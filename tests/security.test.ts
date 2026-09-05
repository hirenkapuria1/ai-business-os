import assert from 'node:assert/strict'
import test from 'node:test'
import { checkRateLimit, redact, validateProductionConfig } from '../src/lib/security.ts'

test('rate limits reject excess requests and reset after the window', () => {
  assert.equal(checkRateLimit('login:test', 2, 1000, 0).allowed, true)
  assert.equal(checkRateLimit('login:test', 2, 1000, 1).allowed, true)
  assert.equal(checkRateLimit('login:test', 2, 1000, 2).allowed, false)
  assert.equal(checkRateLimit('login:test', 2, 1000, 1001).allowed, true)
})

test('structured-log data redacts credentials recursively', () => {
  assert.deepEqual(redact({ email: 'a@b.com', password: 'secret', nested: { paymentSignature: 'sig' } }), { email: 'a@b.com', password: '[REDACTED]', nested: { paymentSignature: '[REDACTED]' } })
})

test('production configuration fails clearly when required values are absent', () => {
  assert.throws(() => validateProductionConfig({}), /DATABASE_URL/)
  assert.throws(() => validateProductionConfig({ DATABASE_URL: 'postgresql:', JWT_SECRET: 'short' }), /minimum 32/)
  assert.doesNotThrow(() => validateProductionConfig({ DATABASE_URL: 'postgresql:', JWT_SECRET: 'a'.repeat(32) }))
})
