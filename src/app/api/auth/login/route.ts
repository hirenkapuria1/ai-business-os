import bcrypt from 'bcryptjs'
import { NextResponse } from 'next/server'
import { loginSchema } from '@/lib/auth-contracts'
import {
  AUTH_COOKIE_NAME,
  AUTH_COOKIE_OPTIONS,
  createSessionToken,
} from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { checkRateLimit, requestKey } from '@/lib/security'
import { logEvent } from '@/lib/logger'

export async function POST(request: Request) {
  const rate = checkRateLimit(requestKey(request, 'auth-login'), 10, 15 * 60 * 1000)
  if (!rate.allowed) return NextResponse.json({ error: 'Too many sign-in attempts. Try again later.' }, { status: 429 })
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
      logEvent('warn', 'auth.login_failed', { email: parsed.data.email })
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
    logEvent('info', 'auth.login_succeeded', { userId: user.id })
    return response
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({ error: 'Unable to sign in' }, { status: 500 })
  }
}
