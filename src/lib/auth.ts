import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'
import { createSignedSession, readSignedSession } from '@/lib/session-token'

export const AUTH_COOKIE_NAME = 'pinreki_session'
export const AUTH_COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: 'lax' as const,
  secure: process.env.NODE_ENV === 'production',
  path: '/',
  maxAge: 60 * 60 * 24 * 7,
}

function getJwtSecret() {
  const secret = process.env.JWT_SECRET

  if (!secret || secret.length < 32) {
    throw new Error('JWT_SECRET must be configured with at least 32 characters')
  }

  return secret
}

export function createSessionToken(userId: string) {
  return createSignedSession(userId, getJwtSecret())
}

export async function getCurrentUser() {
  const token = cookies().get(AUTH_COOKIE_NAME)?.value

  if (!token) {
    return null
  }

  const payload = readSignedSession(token, getJwtSecret())
  if (!payload) return null

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
}
