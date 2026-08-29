'use client'

import { useEffect, useState } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Card from '@/components/Card'
import Button from '@/components/Button'
import Link from 'next/link'

interface Product {
  id: string
  slug: string
  name: string
  shortDescription: string
  price: number
  salePrice?: number
  productImage: string
  category: string
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [selectedCategory, setSelectedCategory] = useState('')
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/products/categories')
        const data = await response.json()
        setCategories(data.categories)
      } catch (error) {
        console.error('Error fetching categories:', error)
      }
    }

    fetchCategories()
  }, [])

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      try {
        const params = new URLSearchParams()
        if (selectedCategory) params.append('category', selectedCategory)
        if (search) params.append('search', search)

        const response = await fetch(`/api/products?${params.toString()}`)
        const data = await response.json()
        setProducts(data.products)
      } catch (error) {
        console.error('Error fetching products:', error)
      } finally {
        setLoading(false)
      }
    }

    const timer = setTimeout(fetchProducts, 500)
    return () => clearTimeout(timer)
  }, [selectedCategory, search])

  return (
    <>
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold mb-8">Digital Products</h1>

        {/* Filters */}
        <div className="mb-8 space-y-4">
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-600"
          />

          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setSelectedCategory('')}
              className={`px-4 py-2 rounded-lg transition ${
                selectedCategory === ''
                  ? 'bg-brand-600 text-white'
                  : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
              }`}
            >
              All
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg transition ${
                  selectedCategory === category
                    ? 'bg-brand-600 text-white'
                    : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading products...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">No products found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <Card key={product.id} className="overflow-hidden">
                <div className="aspect-video bg-gray-200 overflow-hidden">
                  <img
                    src={product.productImage}
                    alt={product.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform"
                  />
                </div>
                <div className="p-6">
                  <p className="text-sm text-brand-600 font-semibold mb-2">
                    {product.category}
                  </p>
                  <h3 className="text-xl font-bold mb-2">{product.name}</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    {product.shortDescription}
                  </p>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      {product.salePrice ? (
                        <>
                          <span className="text-2xl font-bold text-brand-600">
                            ₹{product.salePrice}
                          </span>
                          <span className="text-gray-500 line-through ml-2">
                            ₹{product.price}
                          </span>
                        </>
                      ) : (
                        <span className="text-2xl font-bold text-brand-600">
                          ₹{product.price}
                        </span>
                      )}
                    </div>
                  </div>
                  <Link href={`/products/${product.slug}`}>
                    <Button className="w-full">View Details</Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </>
  )
}
