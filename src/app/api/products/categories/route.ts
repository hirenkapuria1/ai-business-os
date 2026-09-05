import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const categories = await prisma.product.groupBy({
      by: ['category'],
      where: {
        status: 'PUBLISHED',
      },
    })

    return NextResponse.json(
      {
        categories: categories.map((c) => c.category).sort(),
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Get categories error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
