import assert from 'node:assert/strict'
import test from 'node:test'
import { canAccessAdmin, canAccessUserResource } from '../src/lib/access-policy.ts'

test('only administrators can access admin workflows', () => {
  assert.equal(canAccessAdmin('ADMIN'), true)
  assert.equal(canAccessAdmin('CUSTOMER'), false)
})

test('customers can only access resources they own', () => {
  assert.equal(canAccessUserResource('user-1', 'user-1'), true)
  assert.equal(canAccessUserResource('user-1', 'user-2'), false)
})
