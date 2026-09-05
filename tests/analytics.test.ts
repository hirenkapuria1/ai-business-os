import assert from 'node:assert/strict'
import test from 'node:test'
import { aggregateOrders, parseAnalyticsRange } from '../src/lib/analytics-core.ts'

test('analytics counts each paid order once and excludes failed revenue', () => {
  const result = aggregateOrders([
    { status: 'PAID', totalAmount: 100, createdAt: new Date('2026-01-01T03:00:00Z') },
    { status: 'PAID', totalAmount: 50, createdAt: new Date('2026-01-01T20:00:00Z') },
    { status: 'FAILED', totalAmount: 999, createdAt: new Date('2026-01-02T00:00:00Z') },
  ])
  assert.equal(result.revenue, 150)
  assert.equal(result.paidOrders, 2)
  assert.equal(result.totalOrders, 3)
  assert.equal(result.daily.length, 1)
  assert.equal(result.daily[0]?.revenue, 150)
})

test('empty datasets and UTC custom ranges are supported', () => {
  assert.deepEqual(aggregateOrders([]), { revenue: 0, paidOrders: 0, totalOrders: 0, conversionRate: 0, daily: [] })
  const range = parseAnalyticsRange(new URLSearchParams('from=2026-01-01&to=2026-01-31'))
  assert.equal(range.from.toISOString(), '2026-01-01T00:00:00.000Z')
  assert.equal(range.to.toISOString(), '2026-01-31T23:59:59.999Z')
  assert.equal(range.timezone, 'UTC')
})
