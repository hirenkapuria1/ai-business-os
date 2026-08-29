import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Button from '@/components/Button'
import Link from 'next/link'

export default function Home() {
  return (
    <>
      <Header />
      
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Create Smarter. Sell Faster.
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            PINREKI AI gives you proven templates, frameworks, and tools to build and scale your digital products faster.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/products">
              <Button>Browse Products</Button>
            </Link>
            <Link href="/signup">
              <Button variant="outline">Get Started Free</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-12">Why Choose PINREKI AI?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-brand-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🚀</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Fast Implementation</h3>
              <p className="text-gray-600">
                Ready-to-use templates and frameworks save you weeks of development time.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-brand-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🤖</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">AI-Powered</h3>
              <p className="text-gray-600">
                Leverage AI to automate content creation, market research, and customer support.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-brand-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💡</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Proven Strategies</h3>
              <p className="text-gray-600">
                Learn from successful digital entrepreneurs with our battle-tested systems.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-brand-600 text-white py-20">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-4xl font-bold mb-6">Ready to Build Your Digital Business?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join hundreds of creators and entrepreneurs using PINREKI AI to scale their businesses.
          </p>
          <Link href="/signup">
            <Button className="bg-white text-brand-600 hover:bg-gray-100">Start Free Trial</Button>
          </Link>
        </div>
      </section>

      <Footer />
    </>
  )
}
