import assert from 'node:assert/strict'
import test from 'node:test'
import bcrypt from 'bcryptjs'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const uniqueEmail = `ci-${Date.now()}@example.com`

test.after(async () => {
  await prisma.user.deleteMany({ where: { email: uniqueEmail } })
  await prisma.$disconnect()
})

test('registration data persists atomically with a customer profile', async () => {
  const passwordHash = await bcrypt.hash('integration-password', 4)
  const created = await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({ data: { email: uniqueEmail, name: 'CI User', passwordHash } })
    await tx.customer.create({ data: { userId: user.id } })
    return user
  })
  const persisted = await prisma.user.findUnique({ where: { id: created.id }, include: { customer: true } })
  assert.equal(persisted?.email, uniqueEmail)
  assert.ok(persisted?.customer)
  assert.equal(await bcrypt.compare('integration-password', persisted!.passwordHash), true)
})

test('duplicate normalized email is rejected by the database', async () => {
  await assert.rejects(
    prisma.user.create({ data: { email: uniqueEmail, passwordHash: 'unused' } }),
    (error: unknown) => typeof error === 'object' && error !== null && 'code' in error && error.code === 'P2002'
  )
})
