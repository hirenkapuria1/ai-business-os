# Setup guide

## Requirements

- Node.js 22
- npm (lockfile installation is required)
- PostgreSQL 14+

## Clean checkout

```bash
git clone https://github.com/hirenkapuria1/ai-business-os.git
cd ai-business-os
npm ci
```

Copy `.env.example` to `.env.local`, replace placeholders locally, and never commit that file.

Create an empty PostgreSQL database, then run:

```bash
npm run prisma:generate
npm run prisma:deploy
npm run prisma:seed
npm run dev
```

Open `http://localhost:3000`. The seed command is repeatable and creates sample published products plus a development admin. Review `prisma/seed.js` before using it outside development.

## Environment variables

| Variable | Required | Purpose |
|---|---:|---|
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `JWT_SECRET` | Yes | Session signing secret; minimum 32 characters |
| `NEXT_PUBLIC_APP_URL` | Yes in production | Public application origin |
| `RAZORPAY_KEY_ID` | Payment work only | Razorpay public identifier |
| `RAZORPAY_KEY_SECRET` | Payment work only | Razorpay server secret |
| `RESEND_API_KEY` | Email work only | Resend API credential |
| `OPENAI_API_KEY` | AI work only | OpenAI API credential |

## Quality checks

```bash
npm run lint
npm run type-check
npm run test:unit
npm run test:integration
npm run build
```

For integration tests, point `DATABASE_URL` to a disposable migrated database. GitHub Actions provisions one automatically.
