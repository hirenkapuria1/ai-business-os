const bcrypt = require('bcryptjs')
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

const products = [
  {
    slug: 'digital-product-launch-kit',
    name: 'Digital Product Launch Kit',
    category: 'Business Templates',
    shortDescription: 'A practical toolkit for planning and launching a digital product.',
    fullDescription:
      'Plan your offer, launch timeline, messaging, and follow-up using reusable worksheets and checklists.',
    price: '2499.00',
    salePrice: '1999.00',
    productImage: 'https://placehold.co/1200x675?text=Launch+Kit',
    features: ['Launch checklist', 'Offer worksheet', 'Marketing calendar'],
    benefits: ['Launch faster', 'Keep execution organized'],
    targetAudience: 'Creators and small teams preparing their first digital-product launch.',
    status: 'PUBLISHED',
  },
  {
    slug: 'content-system-playbook',
    name: 'Content System Playbook',
    category: 'Marketing',
    shortDescription: 'Build a repeatable content workflow for your business.',
    fullDescription:
      'A step-by-step playbook for turning business goals into a sustainable weekly content system.',
    price: '1499.00',
    salePrice: null,
    productImage: 'https://placehold.co/1200x675?text=Content+Playbook',
    features: ['Planning framework', 'Weekly workflow', 'Publishing checklist'],
    benefits: ['Reduce planning time', 'Publish consistently'],
    targetAudience: 'Founders, consultants, and marketing teams building an organic content engine.',
    status: 'PUBLISHED',
  },
]

async function main() {
  const seedPassword = process.env.SEED_USER_PASSWORD || 'ChangeMe123!'

  if (process.env.NODE_ENV === 'production' && !process.env.SEED_USER_PASSWORD) {
    throw new Error('SEED_USER_PASSWORD is required when seeding in production')
  }

  const passwordHash = await bcrypt.hash(seedPassword, 12)
  const user = await prisma.user.upsert({
    where: { email: 'demo@pinreki.local' },
    update: { name: 'Demo Customer', isActive: true },
    create: {
      email: 'demo@pinreki.local',
      name: 'Demo Customer',
      passwordHash,
    },
  })

  const customer = await prisma.customer.upsert({
    where: { userId: user.id },
    update: {},
    create: { userId: user.id, country: 'India' },
  })

  const seededProducts = []
  for (const product of products) {
    seededProducts.push(
      await prisma.product.upsert({
        where: { slug: product.slug },
        update: product,
        create: product,
      })
    )
  }

  const order = await prisma.order.upsert({
    where: { orderNumber: 'DEMO-ORDER-001' },
    update: {},
    create: {
      orderNumber: 'DEMO-ORDER-001',
      userId: user.id,
      customerId: customer.id,
      subtotal: seededProducts[0].salePrice || seededProducts[0].price,
      totalAmount: seededProducts[0].salePrice || seededProducts[0].price,
      items: {
        create: {
          productId: seededProducts[0].id,
          price: seededProducts[0].salePrice || seededProducts[0].price,
        },
      },
    },
  })

  console.log(
    `Seeded ${seededProducts.length} products, customer ${customer.id}, and order ${order.orderNumber}`
  )
}

main()
  .catch((error) => {
    console.error(error)
    process.exitCode = 1
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
