# PINREKI AI - Digital Product Platform

A modern, full-stack platform for creating, marketing, and selling digital products using AI. Built with Next.js, Prisma, and Razorpay for Indian payments.

![PINREKI AI](https://img.shields.io/badge/Next.js-14-black?style=flat-square)
![Prisma](https://img.shields.io/badge/Prisma-5.7-2D3748?style=flat-square)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.3-38B2AC?style=flat-square)
![Razorpay](https://img.shields.io/badge/Razorpay-2.9-528FFF?style=flat-square)

## 🚀 Features

### Core Platform
- **Digital Product Store** - Showcase and sell digital products with categories and search
- **User Authentication** - Secure login/signup with JWT tokens
- **Product Management** - Create, edit, and manage digital products with images and descriptions
- **Shopping Cart & Checkout** - Complete e-commerce flow with order management
- **Payment Processing** - Razorpay integration for Indian payments (UPI, Cards, Wallets)
- **Order Management** - Track orders, downloads, and customer history
- **Email Notifications** - Automated order confirmations and marketing emails via Resend

### Advanced Features
- **AI-Powered Content** - OpenAI integration for product descriptions and content generation
- **Analytics Dashboard** - Track sales, revenue, and customer insights
- **Subscription Billing** - Support for recurring payments and subscriptions
- **Lead Generation** - Capture leads with lead magnets and email sequences
- **Support Ticketing** - Customer support system with email integration
- **Webhooks** - Real-time payment status updates from Razorpay

## 📋 Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **React Hook Form** - Efficient form handling

### Backend
- **Next.js API Routes** - Serverless backend functions
- **Prisma ORM** - Database management with type safety
- **PostgreSQL** - Relational database
- **JWT** - Authentication tokens

### Third-party Services
- **Razorpay** - Payment gateway for India (UPI, Cards, Wallets)
- **OpenAI API** - AI content generation
- **Resend** - Email service
- **PostgreSQL** - Database

## 🛠️ Installation

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- npm or yarn

### Setup Steps

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/pinreki-ai.git
cd pinreki-ai
```

2. **Install dependencies**
```bash
npm install
```

3. **Setup environment variables**
```bash
cp .env.example .env.local
```

Edit `.env.local` and add your credentials:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/pinreki_ai"
RAZORPAY_KEY_ID="your-razorpay-key"
RAZORPAY_KEY_SECRET="your-razorpay-secret"
RESEND_API_KEY="your-resend-key"
OPENAI_API_KEY="your-openai-key"
JWT_SECRET="your-jwt-secret"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

4. **Setup database**
```bash
npm run prisma:generate
npm run prisma:migrate
```

5. **Start development server**
```bash
npm run dev
```

Visit `http://localhost:3000` in your browser.

## 📁 Project Structure

```
pinreki-ai/
├── src/
│   ├── app/                 # Next.js app router pages
│   │   ├── api/            # API routes
│   │   ├── (auth)/         # Auth pages (login, signup)
│   │   ├── products/       # Product catalog pages
│   │   ├── dashboard/      # User dashboard
│   │   └── page.tsx        # Homepage
│   ├── components/         # Reusable React components
│   ├── lib/               # Utility functions
│   │   ├── prisma.ts      # Prisma client
│   │   ├── razorpay.ts    # Razorpay integration
│   │   ├── email.ts       # Email service
│   │   ├── auth.ts        # Authentication utilities
│   │   └── utils.ts       # Helper functions
│   └── styles/            # Global styles
├── prisma/
│   ├── schema.prisma      # Database schema
│   └── migrations/        # Database migrations
├── public/                # Static files
└── package.json
```

## 🔑 API Endpoints

### Authentication
- `POST /api/auth/register` - Create new account
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Products
- `GET /api/products` - List all products (with filters)
- `GET /api/products/[slug]` - Get product details
- `GET /api/products/categories` - List all categories

### Orders & Payments
- `POST /api/orders/create` - Create new order
- `POST /api/orders/verify-payment` - Verify Razorpay payment
- `GET /api/orders/[id]` - Get order details
- `GET /api/orders/user/[userId]` - List user orders

### Analytics
- `GET /api/analytics/dashboard` - Dashboard metrics
- `GET /api/analytics/sales` - Sales data

## 💳 Payment Integration (Razorpay)

### Why Razorpay for India?
- ✅ **UPI Support** - Direct bank transfers via UPI
- ✅ **Card Payments** - Visa, Mastercard, American Express
- ✅ **Digital Wallets** - Apple Pay, Google Pay, PayPal
- ✅ **Low Fees** - ~2% transaction fee
- ✅ **Instant Settlements** - Fast payouts to your account
- ✅ **Developer Friendly** - Excellent API documentation

### Setup Razorpay
1. Create account at https://razorpay.com
2. Get API keys from dashboard
3. Add to `.env.local`:
   ```
   RAZORPAY_KEY_ID=your_key_id
   RAZORPAY_KEY_SECRET=your_key_secret
   ```

### Payment Flow
1. User adds products to cart
2. Checkout creates order via `/api/orders/create`
3. Frontend redirects to Razorpay checkout
4. After payment, webhook verifies transaction
5. Order marked as paid and confirmation email sent

## 🗄️ Database Schema

Key models:
- **User** - Customer accounts with authentication
- **Customer** - Extended customer profile with preferences
- **Product** - Digital products with metadata
- **Category** - Product categories
- **Order** - Purchase orders with line items
- **OrderItem** - Individual items in orders
- **Payment** - Payment transaction records
- **WebsiteAnalytics** - Traffic and revenue metrics

See `prisma/schema.prisma` for complete schema.

## 🔐 Security

- JWT-based authentication
- Bcrypt password hashing
- HTTPS-only in production
- CORS protection
- Rate limiting (recommended)
- SQL injection prevention via Prisma
- XSS protection via Next.js

## 📧 Email Templates

Automated emails via Resend:
- Order confirmation
- Welcome email
- Lead magnet delivery
- Support replies
- Marketing campaigns

## 🧪 Testing

```bash
# Run tests
npm run test

# Run tests with coverage
npm run test:coverage
```

## 📚 Documentation

- [Database Schema](./docs/database.md)
- [API Documentation](./docs/api.md)
- [Payment Integration Guide](./docs/payments.md)
- [Deployment Guide](./docs/deployment.md)

## 🚢 Deployment

### Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

### Docker
```bash
docker build -t pinreki-ai .
docker run -p 3000:3000 pinreki-ai
```

### Environment Variables in Production
- Set all required environment variables in your deployment platform
- Use secure secret management (e.g., Vercel Secrets, AWS Secrets Manager)

## 📊 Razorpay vs Other Payment Gateways

| Feature | Razorpay | PayU | Cashfree |
|---------|----------|------|----------|
| UPI Support | ✅ | ✅ | ✅ |
| Developer Friendly | ⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐ |
| Settlement Speed | Fast | Standard | Instant |
| Transaction Fee | ~2% | ~2% | 1.9-3.5% |
| API Quality | Excellent | Good | Excellent |

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🎯 Roadmap

- [ ] AI-powered product recommendations
- [ ] Advanced analytics dashboard
- [ ] Affiliate system
- [ ] Multi-vendor marketplace
- [ ] Mobile app (React Native)
- [ ] Admin dashboard
- [ ] Bulk email marketing
- [ ] Video course hosting

## 🆘 Support

- 📧 Email: support@pinreki.ai
- 💬 Discord: [Join community](https://discord.gg/pinrekiai)
- 📖 Docs: [Full documentation](https://docs.pinreki.ai)
- 🐛 Issues: [GitHub Issues](https://github.com/yourusername/pinreki-ai/issues)

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Prisma for excellent ORM
- Razorpay for reliable payments
- Tailwind CSS for styling
- All contributors and supporters

---

**Made with ❤️ by the PINREKI AI team**

⭐ Star us on GitHub if you find this helpful!
