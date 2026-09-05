# Deployment guide

The application can run on any Node.js 22 host with PostgreSQL. Vercel is supported, but deployment is not considered verified until the steps below succeed in the actual production project.

## Before deployment

1. Merge only after the GitHub Actions `quality` job passes.
2. Provision PostgreSQL and obtain its TLS-enabled connection string.
3. Configure `DATABASE_URL`, a unique 32+ character `JWT_SECRET`, and `NEXT_PUBLIC_APP_URL`.
4. Configure provider credentials only for features you enable. Never commit them.
5. Keep Razorpay checkout disabled until issues #4 and #8 are completed.

## Deploy

Use locked dependencies and apply migrations before serving traffic:

```bash
npm ci
npm run prisma:generate
npm run prisma:deploy
npm run build
npm start
```

For Vercel, use `npm run build` as the build command and run `npm run prisma:deploy` through a controlled release/migration step using the production database credential.

## Verify

1. Confirm deployment logs contain no configuration error.
2. Request `/api/health`; require HTTP 200 and `database: connected`.
3. Register, log in, log out, and confirm `/dashboard` redirects when signed out.
4. Confirm a customer cannot open `/admin` or admin analytics endpoints.
5. Confirm an administrator can view products, customers, orders, and analytics.
6. Confirm security headers are present.
7. Review logs to ensure no passwords, cookies, signatures, or API keys appear.

## Rollback

Roll back the application deployment to the previous known-good build. Database migrations are forward-only; prepare and review a corrective migration instead of manually editing production tables.
