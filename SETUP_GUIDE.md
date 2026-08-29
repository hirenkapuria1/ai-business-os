# PINREKI AI - Setup Guide

Complete step-by-step guide to get your PINREKI AI platform up and running.

---

## Phase 1: Local Setup (Your Computer)

### Step 1: Clone the Repository

```bash
# Navigate to where you want to store the project
cd ~/projects

# Clone your repository
git clone https://github.com/hirenkapuria1/ai-business-os.git
cd ai-business-os

# Or if you renamed it to pinreki-ai:
git clone https://github.com/hirenkapuria1/pinreki-ai.git
cd pinreki-ai
```

### Step 2: Install Node.js (If not already installed)

Check if you have Node.js:
```bash
node --version
npm --version
```

If not installed:
- Download from https://nodejs.org (LTS version recommended)
- Install and verify again

### Step 3: Install Project Dependencies

```bash
# Navigate to project folder
cd pinreki-ai

# Install all npm packages
npm install
```

This will install all dependencies from `package.json`:
- React, Next.js, Tailwind CSS
- Prisma, PostgreSQL client
- Razorpay, OpenAI, Resend
- TypeScript and development tools

⏱️ **This takes 2-5 minutes**

---

## Phase 2: Database Setup

### Step 4: Install PostgreSQL Locally

**Option A: Docker (Easiest)**
```bash
# Make sure Docker is installed
docker --version

# Run PostgreSQL in Docker
docker run --name pinreki-postgres \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=password123 \
  -e POSTGRES_DB=pinreki_ai \
  -p 5432:5432 \
  -d postgres:latest
```

**Option B: Direct Installation**
- Download from https://www.postgresql.org/download/
- Install and remember your password
- Create a new database called `pinreki_ai`

### Step 5: Configure Environment Variables

```bash
# Copy the example file
cp .env.example .env.local
```

Now edit `.env.local` with your information:

```env
# Database Connection
DATABASE_URL="postgresql://postgres:password123@localhost:5432/pinreki_ai"

# JWT Authentication
JWT_SECRET="your-super-secret-random-string-here-make-it-long"
JWT_EXPIRY="7d"
NEXTAUTH_SECRET="another-super-secret-random-string-here"

# Razorpay (Get from https://razorpay.com)
RAZORPAY_KEY_ID="rzp_test_xxxxxxxxxxxxx"
RAZORPAY_KEY_SECRET="xxxxxxxxxxxxxxxx"

# OpenAI (Get from https://platform.openai.com)
OPENAI_API_KEY="sk-xxxxxxxxxxxxxxxxxxxxxxxx"

# Resend Email (Get from https://resend.com)
RESEND_API_KEY="re_xxxxxxxxxxxxxxxxxxxxxxxx"

# Application URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### Step 6: Initialize the Database

```bash
# Generate Prisma client
npm run prisma:generate

# Run migrations to create tables
npm run prisma:migrate
```

This creates all the necessary database tables based on `prisma/schema.prisma`.

**Optional:** Explore your database
```bash
npm run prisma:studio
```

Opens a web interface at http://localhost:5555 to see your database

---

## Phase 3: Configure External Services

### Step 7: Get Razorpay API Keys

1. Go to https://razorpay.com
2. Sign up for a free account
3. In Dashboard → Settings → API Keys
4. Copy:
   - **Key ID** → `RAZORPAY_KEY_ID`
   - **Key Secret** → `RAZORPAY_KEY_SECRET`
5. Paste into `.env.local`

**Note:** Test mode keys start with `rzp_test_`

### Step 8: Get OpenAI API Key

1. Go to https://platform.openai.com
2. Sign up or login
3. Go to API Keys section
4. Create new secret key
5. Copy and paste to `.env.local` as `OPENAI_API_KEY`

**Note:** You'll need credits or a paid account to use the API

### Step 9: Get Resend Email API Key

1. Go to https://resend.com
2. Sign up for free
3. Go to API Keys
4. Copy the API key
5. Paste to `.env.local` as `RESEND_API_KEY`

**Note:** Resend is free for first 100 emails/day

---

## Phase 4: Local Development

### Step 10: Start the Development Server

```bash
# Make sure you're in the project directory
cd pinreki-ai

# Start the dev server
npm run dev
```

You should see:
```
> Ready in 2.5s
> Local:        http://localhost:3000
```

### Step 11: Test the Application

Open your browser and visit:
- **Homepage**: http://localhost:3000
- **Products**: http://localhost:3000/products
- **Login**: http://localhost:3000/login
- **Signup**: http://localhost:3000/signup

### Step 12: Create Test User

1. Go to http://localhost:3000/signup
2. Create an account with:
   - Name: Test User
   - Email: test@example.com
   - Password: Test@123456
3. Login to test the flow

---

## Phase 5: Create Sample Data

### Step 13: Add Products to Database

```bash
# Open Prisma Studio
npm run prisma:studio
```

This opens http://localhost:5555

**Create a Category:**
1. Click on `Category` table
2. Click "Add record"
3. Fill in:
   - name: "Templates"
   - description: "Ready-to-use templates"

**Create a Product:**
1. Click on `Product` table
2. Click "Add record"
3. Fill in:
   - name: "Notion Dashboard Template"
   - slug: "notion-dashboard"
   - description: "Complete Notion dashboard setup"
   - shortDescription: "Save hours with pre-built dashboards"
   - price: 2999 (₹29.99)
   - salePrice: 1999 (₹19.99)
   - category: Link to the category you created
   - productImage: "https://via.placeholder.com/400x300"

---

## Phase 6: Understanding Project Structure

### File Organization:

```
pinreki-ai/
├── src/
│   ├── app/
│   │   ├── page.tsx              ← Homepage
│   │   ├── (auth)/
│   │   │   ├── login/page.tsx    ← Login page
│   │   │   └── signup/page.tsx   ← Signup page
│   │   ├── products/
│   │   │   └── page.tsx          ← Products listing
│   │   ├── api/
│   │   │   ├── auth/            ← Authentication endpoints
│   │   │   ├── products/        ← Product endpoints
│   │   │   └── orders/          ← Order & payment endpoints
│   │   └── layout.tsx           ← Root layout
│   ├── components/
│   │   ├── Header.tsx           ← Navigation header
│   │   ├── Footer.tsx           ← Footer
│   │   ├── Button.tsx           ← Reusable button
│   │   └── Card.tsx             ← Reusable card
│   ├── lib/
│   │   ├── prisma.ts           ← Database client
│   │   ├── razorpay.ts         ← Payment integration
│   │   ├── email.ts            ← Email service
│   │   └── auth.ts             ← Auth utilities
│   └── app/globals.css         ← Global styles
├── prisma/
│   ├── schema.prisma           ← Database schema
│   └── migrations/             ← Migration files
├── .env.local                  ← Your secrets (not in git)
├── package.json                ← Dependencies
└── README.md                   ← Documentation
```

---

## Phase 7: Development Workflow

### Common Commands

```bash
# Start dev server
npm run dev

# Generate Prisma client (after schema changes)
npm run prisma:generate

# Run database migrations
npm run prisma:migrate

# Open database studio
npm run prisma:studio

# Build for production
npm run build

# Start production server
npm run start

# Lint code
npm run lint
```

### Making Changes

1. **Edit a page** (e.g., src/app/page.tsx)
2. Save file
3. Browser auto-refreshes (hot reload)
4. See changes immediately

---

## Phase 8: Key Features to Explore

### Authentication System
- **Files**: `src/app/api/auth/`, `src/lib/auth.ts`
- **How it works**: 
  - User signs up → Password hashed with bcrypt
  - JWT token created → Stored in cookie
  - Token verified on each request

### Payment System
- **Files**: `src/lib/razorpay.ts`, `src/app/api/orders/`
- **Flow**:
  1. User adds product to cart
  2. Checkout creates order in database
  3. Razorpay payment created
  4. User pays via Razorpay checkout
  5. Payment verified via webhook
  6. Order marked as paid
  7. Confirmation email sent

### Product Display
- **Files**: `src/app/products/page.tsx`, `src/app/api/products/`
- **Features**:
  - Search products
  - Filter by category
  - Display with images
  - Show price and discount

---

## Phase 9: Troubleshooting

### Problem: Database connection error
```
Error: Can't reach database server at `localhost:5432`
```
**Solution:**
- Check PostgreSQL is running
- Verify DATABASE_URL in .env.local
- If using Docker: `docker ps` to verify container is running

### Problem: Port 3000 already in use
```
Error: listen EADDRINUSE: address already in use :::3000
```
**Solution:**
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use different port
npm run dev -- -p 3001
```

### Problem: Razorpay key not working
**Solution:**
- Verify keys are correct (copy-paste carefully)
- Check you're using TEST keys (starts with `rzp_test_`)
- Go to https://razorpay.com/dashboard to verify

### Problem: npm install fails
**Solution:**
```bash
# Clear cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

---

## Phase 10: Next Development Steps

### After Setup is Complete:

1. **Customize Homepage**
   - Edit `src/app/page.tsx`
   - Change colors, text, images
   - Add your brand messaging

2. **Add More Features**
   - Create dashboard page for users
   - Add admin panel
   - Implement email templates
   - Add more product categories

3. **Connect to Payment Testing**
   - Go to `http://localhost:3000/products`
   - Add product to cart (after creating sample data)
   - Test checkout flow with Razorpay test card

4. **Deploy to Production**
   - Choose hosting (Vercel, AWS, DigitalOcean, etc.)
   - Set up production database
   - Configure environment variables
   - Deploy!

---

## Phase 11: Common Next Questions

### Q: How do I add a new page?
```
1. Create folder: src/app/newpage/
2. Create file: src/app/newpage/page.tsx
3. Write React component
4. Auto-accessible at /newpage
```

### Q: How do I create an API endpoint?
```
1. Create folder: src/app/api/myendpoint/
2. Create file: src/app/api/myendpoint/route.ts
3. Export POST/GET/PUT/DELETE function
4. Auto-accessible at /api/myendpoint
```

### Q: How do I change the database?
```
1. Edit prisma/schema.prisma
2. Run: npm run prisma:migrate
3. Name the migration (e.g., "add_user_phone")
4. Database updated automatically
```

### Q: How do I test payments locally?
```
Use Razorpay TEST card:
- Card Number: 4111 1111 1111 1111
- CVV: Any 3 digits
- Expiry: Any future date
```

---

## Quick Command Reference

```bash
# Setup
npm install
npm run prisma:migrate
npm run dev

# During Development
npm run dev              # Start server
npm run prisma:studio   # View database
npm run lint            # Check code

# Building
npm run build           # Create production build
npm run start           # Run production build

# Troubleshooting
npm run prisma:generate # Regenerate Prisma client
npm cache clean --force # Clear npm cache
```

---

## You're Ready! 🎉

Your PINREKI AI platform is now set up and ready for development. Start with the homepage customization and gradually add more features.

**Happy coding!** 🚀

---

### Need Help?
- 📖 Full Docs: README.md
- 💻 Next.js: https://nextjs.org/docs
- 🗄️ Prisma: https://www.prisma.io/docs
- 💳 Razorpay: https://razorpay.com/developers
- 📧 Resend: https://resend.com/docs
