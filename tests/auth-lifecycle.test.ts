import assert from 'node:assert/strict'
import test from 'node:test'
import bcrypt from 'bcryptjs'
import { loginSchema, registerSchema } from '../src/lib/auth-contracts.ts'
import { createSignedSession, readSignedSession } from '../src/lib/session-token.ts'

const secret = 'test-secret-that-is-longer-than-thirty-two-characters'

test('registration normalizes email and rejects mismatched passwords', () => {
  const valid = registerSchema.parse({ email: ' User@Example.COM ', password: 'password123', passwordConfirm: 'password123' })
  assert.equal(valid.email, 'user@example.com')
  assert.equal(registerSchema.safeParse({ email: 'user@example.com', password: 'password123', passwordConfirm: 'different' }).success, false)
})

test('login rejects malformed credentials', () => {
  assert.equal(loginSchema.safeParse({ email: 'not-an-email', password: '' }).success, false)
})

test('password hashes verify without storing plaintext', async () => {
  const password = 'correct horse battery staple'
  const hash = await bcrypt.hash(password, 4)
  assert.notEqual(hash, password)
  assert.equal(await bcrypt.compare(password, hash), true)
  assert.equal(await bcrypt.compare('wrong password', hash), false)
})

test('sessions validate the signature and reject expired or modified tokens', () => {
  const token = createSignedSession('user-1', secret)
  assert.equal(readSignedSession(token, secret)?.userId, 'user-1')
  assert.equal(readSignedSession(`${token}changed`, secret), null)
  const expired = createSignedSession('user-1', secret, '-1s')
  assert.equal(readSignedSession(expired, secret), null)
})
