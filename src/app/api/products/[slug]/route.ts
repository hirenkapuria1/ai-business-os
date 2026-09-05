import { NextResponse } from 'next/server'

import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

interface RouteContext {
  params: { slug: string }
}

export async function GET(_request: Request, { params }: RouteContext) {
  try {
    const product = await prisma.product.findFirst({
      where: {
        slug: params.slug,
        status: 'PUBLISHED',
      },
      include: {
        files: {
          select: {
            id: true,
            fileName: true,
            fileSize: true,
            fileType: true,
          },
        },
      },
    })

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    return NextResponse.json({
      product: {
        ...product,
        price: product.price.toNumber(),
        salePrice: product.salePrice?.toNumber() ?? null,
      },
    })
  } catch (error) {
    console.error('Get product error:', error)
    return NextResponse.json({ error: 'Unable to load product' }, { status: 500 })
  }
}
