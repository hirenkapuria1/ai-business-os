import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import Button from '@/components/Button'
import Footer from '@/components/Footer'
import Header from '@/components/Header'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

interface ProductPageProps {
  params: { slug: string }
}

async function findPublishedProduct(slug: string) {
  return prisma.product.findFirst({
    where: { slug, status: 'PUBLISHED' },
    select: {
      id: true,
      slug: true,
      name: true,
      category: true,
      shortDescription: true,
      fullDescription: true,
      price: true,
      salePrice: true,
      productImage: true,
      features: true,
      benefits: true,
      targetAudience: true,
      seoTitle: true,
      seoDescription: true,
    },
  })
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const product = await findPublishedProduct(params.slug)

  if (!product) {
    return { title: 'Product not found | PINREKI AI' }
  }

  return {
    title: product.seoTitle || `${product.name} | PINREKI AI`,
    description: product.seoDescription || product.shortDescription,
  }
}

const currencyFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 2,
})

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await findPublishedProduct(params.slug)

  if (!product) {
    notFound()
  }

  const price = product.price.toNumber()
  const salePrice = product.salePrice?.toNumber() ?? null

  return (
    <>
      <Header />
      <main className="mx-auto min-h-screen max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2">
          <div className="overflow-hidden rounded-xl bg-gray-100">
            <img
              src={product.productImage}
              alt={product.name}
              className="aspect-video h-full w-full object-cover"
            />
          </div>

          <div>
            <p className="font-semibold text-brand-600">{product.category}</p>
            <h1 className="mt-2 text-4xl font-bold text-gray-900">{product.name}</h1>
            <p className="mt-4 text-lg text-gray-600">{product.shortDescription}</p>

            <div className="mt-6 flex items-baseline gap-3">
              <span className="text-3xl font-bold text-brand-600">
                {currencyFormatter.format(salePrice ?? price)}
              </span>
              {salePrice !== null && (
                <span className="text-lg text-gray-500 line-through">
                  {currencyFormatter.format(price)}
                </span>
              )}
            </div>

            <Button className="mt-8 w-full sm:w-auto">Add to cart</Button>

            <section className="mt-10">
              <h2 className="text-2xl font-semibold">About this product</h2>
              <p className="mt-3 whitespace-pre-line text-gray-700">
                {product.fullDescription}
              </p>
            </section>

            {product.features.length > 0 && (
              <section className="mt-8">
                <h2 className="text-2xl font-semibold">What&apos;s included</h2>
                <ul className="mt-3 list-inside list-disc space-y-2 text-gray-700">
                  {product.features.map((feature) => (
                    <li key={feature}>{feature}</li>
                  ))}
                </ul>
              </section>
            )}

            <section className="mt-8 rounded-lg bg-brand-50 p-5">
              <h2 className="font-semibold text-gray-900">Who it&apos;s for</h2>
              <p className="mt-2 text-gray-700">{product.targetAudience}</p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
