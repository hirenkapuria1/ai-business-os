import { Prisma } from '@prisma/client'
import { NextResponse } from 'next/server'
import { z } from 'zod'

import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

const querySchema = z.object({
  category: z.string().trim().max(100).optional(),
  search: z.string().trim().max(200).optional(),
})

export async function GET(request: Request) {
  const url = new URL(request.url)
  const parsed = querySchema.safeParse({
    category: url.searchParams.get('category') || undefined,
    search: url.searchParams.get('search') || undefined,
  })

  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid product filters' }, { status: 400 })
  }

  const { category, search } = parsed.data
  const where: Prisma.ProductWhereInput = {
    status: 'PUBLISHED',
    ...(category ? { category } : {}),
    ...(search
      ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { shortDescription: { contains: search, mode: 'insensitive' } },
            { fullDescription: { contains: search, mode: 'insensitive' } },
          ],
        }
      : {}),
  }

  try {
    const products = await prisma.product.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        slug: true,
        name: true,
        shortDescription: true,
        price: true,
        salePrice: true,
        productImage: true,
        category: true,
      },
    })

    return NextResponse.json({
      products: products.map((product) => ({
        ...product,
        price: product.price.toNumber(),
        salePrice: product.salePrice?.toNumber() ?? null,
      })),
    })
  } catch (error) {
    console.error('List products error:', error)
    return NextResponse.json({ error: 'Unable to load products' }, { status: 500 })
  }
}
