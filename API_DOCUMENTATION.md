# API documentation

All request and response bodies use JSON. Authenticated endpoints use the HTTP-only `pinreki_session` cookie. Errors use `{ "error": "message" }` with an appropriate 4xx/5xx status.

## Authentication

### `POST /api/auth/register`

Body: `name` (optional), `email`, `password` (8–128 characters), and matching `passwordConfirm`. Creates the user and customer profile transactionally, returns 201, and sets the session cookie. Duplicate email returns 409.

### `POST /api/auth/login`

Body: `email` and `password`. Returns a safe user object and sets the session cookie. Invalid credentials return 401. Login and registration are rate limited.

### `POST /api/auth/logout`

Expires the session cookie.

### `GET /api/auth/me`

Returns the active signed-in user. Missing, invalid, or expired sessions return 401.

## Products

### `GET /api/products`

Lists published products. Supported query parameters are `category`, `search`, `sort`, `page`, and `limit` as implemented by the route.

### `GET /api/products/[slug]`

Returns one published product or 404.

### `GET /api/products/categories`

Returns sorted categories belonging to published products.

Product creation, editing, publishing, and archiving currently use authorization-protected server actions on `/admin`, not public API routes.

## Analytics (administrator only)

### `GET /api/analytics/dashboard`

Returns range metadata plus revenue, paid/total orders, conversion rate, new customers, and daily results.

### `GET /api/analytics/sales`

Returns range metadata, revenue, paid-order count, and daily sales.

Both accept optional inclusive `from` and `to` dates in `YYYY-MM-DD`, use UTC, default to 30 days, and reject ranges over 366 days. See `ANALYTICS.md`.

## Operations

### `GET /api/health`

Returns 200 when PostgreSQL is reachable or 503 when unavailable. It exposes no credentials.

## Legacy payment route

### `POST /api/orders/verify-payment`

This route exists but is not approved for production use. Complete issues #4 and #8 before enabling checkout. It is rate limited, but its full idempotent webhook workflow remains postponed.

## Routes that do not yet exist

Cart, order creation, secure download tokens, Razorpay webhooks, AI generation, subscriptions, campaigns, and support APIs remain roadmap work and are intentionally not documented as available endpoints.
