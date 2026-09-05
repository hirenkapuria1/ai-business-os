import bcrypt from 'bcryptjs'
import { Prisma } from '@prisma/client'
import { NextResponse } from 'next/server'
import { registerSchema } from '@/lib/auth-contracts'
import {
  AUTH_COOKIE_NAME,
  AUTH_COOKIE_OPTIONS,
  createSessionToken,
} from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { checkRateLimit, requestKey } from '@/lib/security'
import { logEvent } from '@/lib/logger'

export async function POST(request: Request) {
  const rate = checkRateLimit(requestKey(request, 'auth-register'), 5, 60 * 60 * 1000)
  if (!rate.allowed) return NextResponse.json({ error: 'Too many registration attempts. Try again later.' }, { status: 429 })
  try {
    const parsed = registerSchema.safeParse(await request.json())

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? 'Invalid registration data' },
        { status: 400 }
      )
    }

    const { email, name, password } = parsed.data
    const passwordHash = await bcrypt.hash(password, 12)
    const user = await prisma.$transaction(async (transaction) => {
      const createdUser = await transaction.user.create({
        data: { email, name: name || null, passwordHash },
        select: { id: true, email: true, name: true, role: true },
      })

      await transaction.customer.create({ data: { userId: createdUser.id } })
      return createdUser
    })

    const response = NextResponse.json({ user }, { status: 201 })
    response.cookies.set(
      AUTH_COOKIE_NAME,
      createSessionToken(user.id),
      AUTH_COOKIE_OPTIONS
    )
    logEvent('info', 'auth.registration_succeeded', { userId: user.id })
    return response
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      logEvent('warn', 'auth.registration_duplicate')
      return NextResponse.json(
        { error: 'An account with this email already exists' },
        { status: 409 }
      )
    }

    console.error('Registration error:', error)
    return NextResponse.json({ error: 'Unable to create account' }, { status: 500 })
  }
}
