import { cookies } from 'next/headers'
import jwt, { type JwtPayload } from 'jsonwebtoken'

import { prisma } from '@/lib/prisma'

export const AUTH_COOKIE_NAME = 'pinreki_session'
export const AUTH_COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: 'lax' as const,
  secure: process.env.NODE_ENV === 'production',
  path: '/',
  maxAge: 60 * 60 * 24 * 7,
}

interface SessionPayload extends JwtPayload {
  userId: string
}

function getJwtSecret() {
  const secret = process.env.JWT_SECRET

  if (!secret) {
    throw new Error('JWT_SECRET is not configured')
  }

  return secret
}

function isSessionPayload(payload: string | JwtPayload): payload is SessionPayload {
  return typeof payload !== 'string' && typeof payload.userId === 'string'
}

export function createSessionToken(userId: string) {
  return jwt.sign({ userId }, getJwtSecret(), { expiresIn: '7d' })
}

export async function getCurrentUser() {
  const token = cookies().get(AUTH_COOKIE_NAME)?.value

  if (!token) {
    return null
  }

  try {
    const payload = jwt.verify(token, getJwtSecret())

    if (!isSessionPayload(payload)) {
      return null
    }

    return prisma.user.findFirst({
      where: {
        id: payload.userId,
        isActive: true,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
    })
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return null
    }

    throw error
  }
}
