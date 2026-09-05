import Link from 'next/link'
import { redirect } from 'next/navigation'

import Footer from '@/components/Footer'
import Header from '@/components/Header'
import { getCurrentUser } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <>
      <Header />
      <main className="mx-auto min-h-screen max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold">Dashboard</h1>
        <p className="mt-3 text-gray-600">
          Welcome{user.name ? `, ${user.name}` : ''}. Your account is ready.
        </p>
        <section className="mt-8 rounded-lg bg-white p-6 shadow-md">
          <h2 className="text-xl font-semibold">Account</h2>
          <dl className="mt-4 space-y-2">
            <div>
              <dt className="text-sm text-gray-500">Email</dt>
              <dd>{user.email}</dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500">Role</dt>
              <dd>{user.role}</dd>
            </div>
          </dl>
          <Link href="/products" className="mt-6 inline-block font-semibold text-brand-600">
            Browse products
          </Link>
        </section>
      </main>
      <Footer />
    </>
  )
}
