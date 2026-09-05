'use server'

import { Prisma, ProductStatus } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { requireAdmin } from '@/lib/authorization'
import { prisma } from '@/lib/prisma'

const productSchema = z.object({
  name: z.string().trim().min(2).max(120),
  slug: z.string().trim().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  category: z.string().trim().min(2).max(80),
  shortDescription: z.string().trim().min(10).max(300),
  fullDescription: z.string().trim().min(10),
  price: z.coerce.number().nonnegative(),
  productImage: z.string().url(),
  targetAudience: z.string().trim().min(2),
})

export async function saveProduct(formData: FormData) {
  await requireAdmin()
  const parsed = productSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) throw new Error('Invalid product details')
  const id = formData.get('id')?.toString()
  const data = { ...parsed.data, price: new Prisma.Decimal(parsed.data.price) }

  if (id) await prisma.product.update({ where: { id }, data })
  else await prisma.product.create({ data: { ...data, features: [], benefits: [], faq: [] } })

  revalidatePath('/admin')
  revalidatePath('/products')
}

export async function setProductStatus(formData: FormData) {
  await requireAdmin()
  const parsed = z.object({ id: z.string().min(1), status: z.nativeEnum(ProductStatus) }).parse(Object.fromEntries(formData))
  await prisma.product.update({ where: { id: parsed.id }, data: { status: parsed.status } })
  revalidatePath('/admin')
  revalidatePath('/products')
}
