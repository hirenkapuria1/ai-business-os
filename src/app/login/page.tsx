'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import Button from '@/components/Button'
import Footer from '@/components/Footer'
import Header from '@/components/Header'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Unable to sign in')
      }

      router.push('/dashboard')
      router.refresh()
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Unable to sign in')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Header />
      <main className="flex min-h-screen items-center justify-center px-4 py-12">
        <section className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
          <h1 className="mb-6 text-center text-3xl font-bold">Welcome back</h1>
          {error && (
            <p className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
              {error}
            </p>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="block text-sm font-semibold">
              Email
              <input
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                className="mt-2 w-full rounded-lg border px-4 py-2"
              />
            </label>
            <label className="block text-sm font-semibold">
              Password
              <input
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                className="mt-2 w-full rounded-lg border px-4 py-2"
              />
            </label>
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? 'Signing in…' : 'Sign in'}
            </Button>
          </form>
          <p className="mt-4 text-center text-gray-600">
            Need an account?{' '}
            <Link href="/signup" className="font-semibold text-brand-600">
              Sign up
            </Link>
          </p>
        </section>
      </main>
      <Footer />
    </>
  )
}
