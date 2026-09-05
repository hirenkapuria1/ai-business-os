import { prisma } from '@/lib/prisma'
export { aggregateOrders, parseAnalyticsRange } from '@/lib/analytics-core'
import { aggregateOrders } from '@/lib/analytics-core'

export async function getAnalyticsData(from: Date, to: Date) {
  const [orders, customers] = await Promise.all([
    prisma.order.findMany({
      where: { createdAt: { gte: from, lte: to } },
      select: { status: true, totalAmount: true, createdAt: true },
      orderBy: { createdAt: 'asc' },
    }),
    prisma.customer.count({ where: { createdAt: { gte: from, lte: to } } }),
  ])
  return { ...aggregateOrders(orders), newCustomers: customers }
}
