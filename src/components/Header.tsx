'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-brand-600">
          PINREKI AI
        </Link>

        <div className="hidden md:flex gap-8">
          <Link
            href="/products"
            className="text-gray-700 hover:text-brand-600 transition"
          >
            Products
          </Link>
          <Link
            href="/about"
            className="text-gray-700 hover:text-brand-600 transition"
          >
            About
          </Link>
          <Link
            href="/blog"
            className="text-gray-700 hover:text-brand-600 transition"
          >
            Blog
          </Link>
          <Link
            href="/contact"
            className="text-gray-700 hover:text-brand-600 transition"
          >
            Contact
          </Link>
        </div>

        <div className="flex gap-4">
          <Link
            href="/login"
            className="px-4 py-2 text-brand-600 hover:text-brand-800 transition"
          >
            Login
          </Link>
          <Link
            href="/signup"
            className="px-6 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition"
          >
            Sign Up
          </Link>
        </div>

        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden text-gray-600"
        >
          ☰
        </button>
      </nav>

      {isMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="px-4 py-2 space-y-2">
            <Link href="/products" className="block py-2 text-gray-700">
              Products
            </Link>
            <Link href="/about" className="block py-2 text-gray-700">
              About
            </Link>
            <Link href="/blog" className="block py-2 text-gray-700">
              Blog
            </Link>
            <Link href="/contact" className="block py-2 text-gray-700">
              Contact
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
