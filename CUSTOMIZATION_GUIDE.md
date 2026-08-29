# PINREKI AI - Customization Guide

Learn how to customize PINREKI AI to match your brand.

---

## Part 1: Branding & Colors

### Change Brand Colors

**File:** `tailwind.config.js`

```javascript
theme: {
  extend: {
    colors: {
      brand: {
        50: '#f0f9ff',
        100: '#e0f2fe',
        200: '#bae6fd',
        300: '#7dd3fc',
        400: '#38bdf8',
        500: '#0ea5e9',
        600: '#0284c7',      // Change this
        700: '#0369a1',      // And this
        800: '#075985',
        900: '#0c3d66',
      },
    },
  },
}
```

**How to get color shades:**
1. Choose your primary color (e.g., #FF6B6B)
2. Go to https://tailwindshades.com
3. Paste your color
4. Copy all shades
5. Replace in tailwind.config.js
6. Restart dev server

### Change Logo/Brand Name

**File:** `src/components/Header.tsx`

```tsx
// Change from:
<Link href="/" className="text-2xl font-bold text-brand-600">
  PINREKI AI
</Link>

// To:
<Link href="/" className="text-2xl font-bold text-brand-600">
  <img src="/logo.png" alt="Logo" height={40} />
</Link>
```

### Add Logo

1. Add your logo file to `public/logo.png`
2. Update Header component (see above)
3. Update Footer if needed

---

## Part 2: Homepage Customization

### Edit Hero Section

**File:** `src/app/page.tsx`

```tsx
// Current:
<h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
  Create Smarter. Sell Faster.
</h1>

// Change to your headline:
<h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
  Your Custom Headline Here
</h1>
```

### Add Your Own Features

```tsx
// Find the features section and update:
<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
  <div className="text-center">
    <div className="w-16 h-16 bg-brand-100 rounded-full flex items-center justify-center mx-auto mb-4">
      <span className="text-2xl">📱</span>  {/* Change emoji */}
    </div>
    <h3 className="text-xl font-semibold mb-2">Feature Name</h3>
    <p className="text-gray-600">
      Your feature description here.
    </p>
  </div>
</div>
```

### Add Background Images

```tsx
// Add to hero section:
<section className="bg-cover bg-center py-20" 
  style={{backgroundImage: 'url(/hero-bg.jpg)'}}>
  {/* Content */}
</section>
```

---

## Part 3: Styling & Fonts

### Change Fonts

**File:** `src/app/layout.tsx`

Add Google Fonts:

```tsx
import { Inter, Poppins } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })
const poppins = Poppins({ 
  weight: ['400', '700'],
  subsets: ['latin'] 
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={poppins.className}>
      <body>{children}</body>
    </html>
  )
}
```

### Change Font Size

**File:** `src/app/globals.css`

```css
h1 {
  font-size: 4rem;  /* Change from 3.5rem */
}

h2 {
  font-size: 3rem;  /* Change from 2.5rem */
}
```

### Add Custom Styles

```css
/* Add to globals.css */
.custom-button {
  @apply px-6 py-2 bg-blue-600 text-white rounded-lg 
    hover:bg-blue-700 transition-all;
}

.custom-card {
  @apply bg-white rounded-lg shadow-lg p-6 
    hover:shadow-xl transition-shadow;
}
```

Use in components:
```tsx
<button className="custom-button">Click Me</button>
<div className="custom-card">Content</div>
```

---

## Part 4: Adding Pages

### Create About Page

**Create:** `src/app/about/page.tsx`

```tsx
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function About() {
  return (
    <>
      <Header />
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-6">About PINREKI AI</h1>
        <p className="text-lg text-gray-600 mb-4">
          Your company story here...
        </p>
      </div>
      <Footer />
    </>
  )
}
```

### Create Contact Page

**Create:** `src/app/contact/page.tsx`

```tsx
'use client'

import { useState } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Button from '@/components/Button'

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Send to your email service
    console.log(formData)
  }

  return (
    <>
      <Header />
      <div className="max-w-2xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-6">Contact Us</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Your Name"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            className="w-full px-4 py-2 border rounded-lg"
          />
          <input
            type="email"
            placeholder="Your Email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            className="w-full px-4 py-2 border rounded-lg"
          />
          <textarea
            placeholder="Your Message"
            value={formData.message}
            onChange={(e) => setFormData({...formData, message: e.target.value})}
            className="w-full px-4 py-2 border rounded-lg h-32"
          />
          <Button>Send Message</Button>
        </form>
      </div>
      <Footer />
    </>
  )
}
```

### Create Blog Page

**Create:** `src/app/blog/page.tsx`

```tsx
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'

const blogPosts = [
  {
    id: 1,
    title: 'Getting Started with PINREKI AI',
    excerpt: 'Learn the basics...',
    date: '2024-01-01',
    slug: 'getting-started'
  },
  // Add more posts
]

export default function Blog() {
  return (
    <>
      <Header />
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-12">Blog</h1>
        <div className="grid gap-8">
          {blogPosts.map(post => (
            <Link key={post.id} href={`/blog/${post.slug}`}>
              <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
                <h2 className="text-2xl font-bold mb-2">{post.title}</h2>
                <p className="text-gray-600 mb-4">{post.excerpt}</p>
                <span className="text-sm text-gray-500">{post.date}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
      <Footer />
    </>
  )
}
```

---

## Part 5: Component Customization

### Customize Button Component

**File:** `src/components/Button.tsx`

```tsx
// Add new variant:
const variants = {
  primary: 'bg-brand-600 text-white hover:bg-brand-700',
  secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300',
  outline: 'border-2 border-brand-600 text-brand-600 hover:bg-brand-50',
  danger: 'bg-red-600 text-white hover:bg-red-700',  // New
  success: 'bg-green-600 text-white hover:bg-green-700',  // New
}
```

### Customize Card Component

**File:** `src/components/Card.tsx`

```tsx
'use client'

interface CardProps {
  children: React.ReactNode
  className?: string
  onClick?: () => void
  variant?: 'default' | 'elevated' | 'outlined'
}

export default function Card({ 
  children, 
  className = '', 
  onClick,
  variant = 'default'
}: CardProps) {
  const variants = {
    default: 'bg-white rounded-lg shadow-md hover:shadow-lg',
    elevated: 'bg-white rounded-lg shadow-lg hover:shadow-xl',
    outlined: 'bg-white rounded-lg border-2 border-gray-200'
  }

  return (
    <div
      className={`${variants[variant]} transition-shadow ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  )
}
```

---

## Part 6: Email Templates

### Customize Order Confirmation Email

**File:** `src/lib/email.ts`

```typescript
export async function sendOrderConfirmationEmail(
  email: string,
  order: any
) {
  try {
    await resend.emails.send({
      from: 'orders@pinreki.ai',  // Change email
      to: email,
      subject: `Order Confirmed - ${order.orderNumber}`,  // Change subject
      html: `
        <html>
          <body style="font-family: Arial, sans-serif;">
            <h1 style="color: #0284c7;">Order Confirmed!</h1>
            <p>Dear Customer,</p>
            <p>Thank you for your purchase!</p>
            <p><strong>Order Number:</strong> ${order.orderNumber}</p>
            <p><strong>Total Amount:</strong> ₹${order.totalAmount}</p>
            <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/account/orders"
               style="background-color: #0284c7; color: white; 
                      padding: 10px 20px; text-decoration: none;
                      border-radius: 5px;">
              View Order
            </a></p>
          </body>
        </html>
      `,
    })
  } catch (error) {
    console.error('Send order confirmation email error:', error)
  }
}
```

---

## Part 7: SEO Optimization

### Update Metadata

**File:** `src/app/layout.tsx`

```tsx
export const metadata: Metadata = {
  title: 'PINREKI AI - Digital Products & Templates',  // Change
  description: 'Create, market, and sell digital products using AI',  // Change
  openGraph: {
    title: 'PINREKI AI',  // Change
    description: 'Digital products made easy',  // Change
    type: 'website',
  },
  keywords: ['digital products', 'templates', 'AI'],  // Change
}
```

### Add Meta Tags to Pages

```tsx
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Products - PINREKI AI',
  description: 'Browse our digital products and templates',
}

export default function Products() {
  // Your component
}
```

---

## Part 8: Adding Images

### Add Hero Image

1. Save image to `public/hero.jpg`
2. Update homepage:

```tsx
<section className="bg-cover bg-center py-20" 
  style={{backgroundImage: 'url(/hero.jpg)'}}>
  {/* Content with semi-transparent overlay */}
</section>
```

### Add Product Images

1. Save images to `public/products/`
2. Display in components:

```tsx
import Image from 'next/image'

<Image
  src="/products/product-1.jpg"
  alt="Product Name"
  width={400}
  height={300}
  priority
/>
```

---

## Part 9: Performance Optimization

### Enable Image Optimization

**File:** `next.config.js`

```javascript
module.exports = {
  images: {
    domains: ['your-domain.com'],
    formats: ['image/avif', 'image/webp'],
  },
}
```

### Add Analytics

```tsx
// Add to layout.tsx
import { Analytics } from '@vercel/analytics/react'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
```

---

## Part 10: Deployment Customization

### Change App Name in Package.json

```json
{
  "name": "pinreki-ai",
  "version": "1.0.0",
  "description": "Your app description"
}
```

### Update Environment Variables for Production

```env
NEXT_PUBLIC_APP_URL=https://yourdomain.com
RAZORPAY_KEY_ID=your_live_key
RESEND_API_KEY=your_production_key
```

---

## Customization Checklist

- [ ] Update brand colors in Tailwind config
- [ ] Add your logo to Header/Footer
- [ ] Update homepage copy and headlines
- [ ] Add company images
- [ ] Create About page
- [ ] Create Contact page
- [ ] Customize email templates
- [ ] Update metadata for SEO
- [ ] Add Google Analytics
- [ ] Change default fonts
- [ ] Update social media links
- [ ] Deploy to production

---

## Next Steps

1. Follow the customization guides above
2. Test locally with `npm run dev`
3. Deploy to production
4. Monitor analytics
5. Gather user feedback
6. Keep iterating!

**Happy customizing!** 🎨
