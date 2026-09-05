import bcrypt from 'bcryptjs'
import { NextResponse } from 'next/server'
import { z } from 'zod'

import {
  AUTH_COOKIE_NAME,
  AUTH_COOKIE_OPTIONS,
  createSessionToken,
} from '@/lib/auth'
import { prisma } from '@/lib/prisma'

const loginSchema = z.object({
  email: z.string().trim().email().transform((value) => value.toLowerCase()),
  password: z.string().min(1).max(128),
})

export async function POST(request: Request) {
  try {
    const parsed = loginSchema.safeParse(await request.json())

    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({ where: { email: parsed.data.email } })
    const passwordMatches = user
      ? await bcrypt.compare(parsed.data.password, user.passwordHash)
      : false

    if (!user || !user.isActive || !passwordMatches) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
    }

    const response = NextResponse.json({
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
    })
    response.cookies.set(
      AUTH_COOKIE_NAME,
      createSessionToken(user.id),
      AUTH_COOKIE_OPTIONS
    )
    return response
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({ error: 'Unable to sign in' }, { status: 500 })
  }
}
