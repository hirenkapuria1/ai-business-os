# PINREKI AI

PINREKI AI is a Next.js 14 digital-product storefront with PostgreSQL/Prisma, account authentication, customer downloads, product administration, analytics, and automated quality checks.

## Implemented

- Registration, login, logout, secure session cookies, and role-based access
- Published-product catalog, categories, and product detail pages
- Customer dashboard with account details, orders, and paid-order downloads
- Admin product creation/editing/status controls, order inspection, and customer listing
- Admin analytics APIs and visualization with UTC date ranges
- Security headers, rate limits, redacted structured logs, configuration validation, and health check
- GitHub Actions checks for install, Prisma, migrations, lint, types, tests, and build

## Not yet complete

- Cart and order creation UI
- Production-ready Razorpay verification/webhooks
- End-to-end checkout and secure download-token delivery
- AI generation HTTP endpoints and UI
- Email campaign, support, subscription, and publishing automations

Do not treat the repository as production-ready until the remaining payment/checkout work is completed and deployment has been verified in the target environment.

## Quick start

Requirements: Node.js 22, npm, and PostgreSQL 14 or later.

```bash
git clone https://github.com/hirenkapuria1/ai-business-os.git
cd ai-business-os
npm ci
copy .env.example .env.local
npm run prisma:generate
npm run prisma:deploy
npm run prisma:seed
npm run dev
```

On macOS/Linux, replace `copy` with `cp`. Edit `.env.local` before running database commands. See [SETUP_GUIDE.md](./SETUP_GUIDE.md).

## Verification

```bash
npm run lint
npm run type-check
npm run test:unit
npm run test:integration
npm run build
```

Integration tests require a migrated test database. `npm run check` runs the full sequence. GitHub Actions runs it with a clean PostgreSQL 16 service.

## Existing HTTP endpoints

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`
- `GET /api/products`
- `GET /api/products/[slug]`
- `GET /api/products/categories`
- `POST /api/orders/verify-payment` (legacy; not production-ready)
- `GET /api/analytics/dashboard` (admin)
- `GET /api/analytics/sales` (admin)
- `GET /api/health`

See [API_DOCUMENTATION.md](./API_DOCUMENTATION.md), [ANALYTICS.md](./ANALYTICS.md), and [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md).

## Roadmap

- [ ] Complete Razorpay hardening (#4)
- [ ] Complete cart, order creation, checkout, and downloads (#8)
- [ ] Add production-grade AI generation workflows
- [ ] Add email campaigns and support workflows
- [ ] Add subscription billing only after its data model and provider flow are designed

## License

MIT — see [LICENSE](./LICENSE).
