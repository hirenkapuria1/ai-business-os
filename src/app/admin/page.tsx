import Link from 'next/link'
import { requireAdmin } from '@/lib/authorization'
import { prisma } from '@/lib/prisma'
import { saveProduct, setProductStatus } from './actions'

export const dynamic = 'force-dynamic'

export default async function AdminPage() {
  await requireAdmin()
  const [products, orders, customers] = await Promise.all([
    prisma.product.findMany({ orderBy: { updatedAt: 'desc' } }),
    prisma.order.findMany({ orderBy: { createdAt: 'desc' }, take: 50, select: { id: true, orderNumber: true, status: true, totalAmount: true, createdAt: true, user: { select: { email: true } }, items: { select: { quantity: true, product: { select: { name: true } } } } } }),
    prisma.customer.findMany({ orderBy: { createdAt: 'desc' }, take: 50, select: { id: true, company: true, totalSpent: true, user: { select: { name: true, email: true, isActive: true } }, _count: { select: { orders: true } } } }),
  ])
  return <main className="mx-auto min-h-screen max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
    <div className="flex items-center justify-between"><h1 className="text-4xl font-bold">Admin</h1><Link href="/dashboard" className="font-semibold text-brand-600">Customer dashboard</Link></div>
    <section className="mt-8 rounded-lg bg-white p-6 shadow-md"><h2 className="text-2xl font-semibold">Create product</h2><ProductForm/></section>
    <section className="mt-8"><h2 className="text-2xl font-semibold">Products</h2><div className="mt-4 space-y-4">{products.map((product) => <article key={product.id} className="rounded-lg bg-white p-6 shadow-md"><div className="flex flex-wrap items-center justify-between gap-3"><div><h3 className="font-semibold">{product.name}</h3><p className="text-sm text-gray-500">{product.status} · ₹{product.price.toString()}</p></div><StatusControls id={product.id}/></div><details className="mt-4"><summary className="cursor-pointer font-semibold text-brand-600">Edit product</summary><ProductForm product={product}/></details></article>)}</div></section>
    <section className="mt-10"><h2 className="text-2xl font-semibold">Recent orders</h2><div className="mt-4 overflow-x-auto rounded-lg bg-white shadow-md"><table className="min-w-full text-left text-sm"><thead><tr className="border-b"><th className="p-4">Order</th><th className="p-4">Customer</th><th className="p-4">Items</th><th className="p-4">Status</th><th className="p-4">Total</th></tr></thead><tbody>{orders.map((order) => <tr key={order.id} className="border-b"><td className="p-4">{order.orderNumber}<br/><span className="text-gray-500">{order.createdAt.toLocaleDateString()}</span></td><td className="p-4">{order.user.email}</td><td className="p-4">{order.items.map((item) => `${item.product.name} × ${item.quantity}`).join(', ')}</td><td className="p-4">{order.status}</td><td className="p-4">₹{order.totalAmount.toString()}</td></tr>)}</tbody></table></div></section>
    <section className="mt-10"><h2 className="text-2xl font-semibold">Customers</h2><div className="mt-4 overflow-x-auto rounded-lg bg-white shadow-md"><table className="min-w-full text-left text-sm"><thead><tr className="border-b"><th className="p-4">Customer</th><th className="p-4">Company</th><th className="p-4">Orders</th><th className="p-4">Spent</th><th className="p-4">Active</th></tr></thead><tbody>{customers.map((customer) => <tr key={customer.id} className="border-b"><td className="p-4">{customer.user.name || '—'}<br/><span className="text-gray-500">{customer.user.email}</span></td><td className="p-4">{customer.company || '—'}</td><td className="p-4">{customer._count.orders}</td><td className="p-4">₹{customer.totalSpent.toString()}</td><td className="p-4">{customer.user.isActive ? 'Yes' : 'No'}</td></tr>)}</tbody></table></div></section>
  </main>
}

type ProductFormValue = { id: string; name: string; slug: string; category: string; shortDescription: string; fullDescription: string; price: { toString(): string }; productImage: string; targetAudience: string }
function ProductForm({ product }: { product?: ProductFormValue }) {
  const fields = [['name','Name'],['slug','Slug'],['category','Category'],['shortDescription','Short description'],['fullDescription','Full description'],['price','Price'],['productImage','Image URL'],['targetAudience','Target audience']] as const
  return <form action={saveProduct} className="mt-4 grid gap-4 sm:grid-cols-2">{product && <input type="hidden" name="id" value={product.id}/>} {fields.map(([name,label]) => <label key={name} className={name === 'fullDescription' ? 'sm:col-span-2' : ''}><span className="mb-1 block text-sm font-medium">{label}</span>{name === 'fullDescription' ? <textarea required name={name} defaultValue={product?.[name]?.toString()} className="min-h-28 w-full rounded border p-2"/> : <input required name={name} type={name === 'price' ? 'number' : name === 'productImage' ? 'url' : 'text'} step={name === 'price' ? '0.01' : undefined} defaultValue={product?.[name]?.toString()} className="w-full rounded border p-2"/>}</label>)}<button className="rounded bg-brand-600 px-4 py-2 font-semibold text-white sm:col-span-2">{product ? 'Save changes' : 'Create product'}</button></form>
}

function StatusControls({ id }: { id: string }) {
  return <div className="flex gap-2">{(['DRAFT','PUBLISHED','ARCHIVED'] as const).map((status) => <form key={status} action={setProductStatus}><input type="hidden" name="id" value={id}/><input type="hidden" name="status" value={status}/><button className="rounded border px-3 py-1 text-sm">{status}</button></form>)}</div>
}
