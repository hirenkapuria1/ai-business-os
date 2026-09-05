import Link from 'next/link'
import Footer from '@/components/Footer'
import Header from '@/components/Header'
import { requireUser } from '@/lib/authorization'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const user = await requireUser()
  const account = await prisma.user.findUniqueOrThrow({
    where: { id: user.id },
    select: {
      email: true, name: true, role: true, createdAt: true,
      customer: { select: { company: true, phone: true, city: true, country: true } },
      orders: {
        orderBy: { createdAt: 'desc' },
        select: {
          id: true, orderNumber: true, status: true, totalAmount: true, createdAt: true,
          items: { select: { id: true, quantity: true, product: { select: { name: true, files: { select: { id: true, fileName: true, fileUrl: true } } } } } },
        },
      },
    },
  })

  return <><Header/><main className="mx-auto min-h-screen max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
    <div className="flex flex-wrap items-center justify-between gap-4"><div><h1 className="text-4xl font-bold">Dashboard</h1><p className="mt-2 text-gray-600">Welcome{account.name ? `, ${account.name}` : ''}.</p></div>{account.role === 'ADMIN' && <Link href="/admin" className="rounded bg-gray-900 px-4 py-2 font-semibold text-white">Admin area</Link>}</div>
    <section className="mt-8 rounded-lg bg-white p-6 shadow-md"><h2 className="text-xl font-semibold">Account details</h2><dl className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"><Detail label="Email" value={account.email}/><Detail label="Name" value={account.name}/><Detail label="Company" value={account.customer?.company}/><Detail label="Phone" value={account.customer?.phone}/><Detail label="Location" value={[account.customer?.city, account.customer?.country].filter(Boolean).join(', ')}/><Detail label="Member since" value={account.createdAt.toLocaleDateString()}/></dl></section>
    <section className="mt-8"><div className="flex items-center justify-between"><h2 className="text-2xl font-semibold">Orders and downloads</h2><Link href="/products" className="font-semibold text-brand-600">Browse products</Link></div>
      {account.orders.length === 0 ? <div className="mt-4 rounded-lg bg-white p-8 text-center text-gray-600 shadow-md">You have no orders yet.</div> : <div className="mt-4 space-y-4">{account.orders.map((order) => <article key={order.id} className="rounded-lg bg-white p-6 shadow-md"><div className="flex flex-wrap justify-between gap-2"><div><h3 className="font-semibold">{order.orderNumber}</h3><p className="text-sm text-gray-500">{order.createdAt.toLocaleDateString()}</p></div><div className="text-right"><p className="font-semibold">₹{order.totalAmount.toString()}</p><p className="text-sm">{order.status}</p></div></div><ul className="mt-4 space-y-3">{order.items.map((item) => <li key={item.id} className="border-t pt-3"><p>{item.product.name} × {item.quantity}</p>{order.status === 'PAID' && item.product.files.length > 0 && <div className="mt-2 flex flex-wrap gap-3">{item.product.files.map((file) => <a key={file.id} href={file.fileUrl} className="text-sm font-semibold text-brand-600" download>{file.fileName}</a>)}</div>}</li>)}</ul></article>)}</div>}
    </section>
  </main><Footer/></>
}

function Detail({ label, value }: { label: string; value?: string | null }) {
  return <div><dt className="text-sm text-gray-500">{label}</dt><dd>{value || 'Not provided'}</dd></div>
}
