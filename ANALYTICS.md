# Analytics definitions

Analytics endpoints require an authenticated administrator. Both accept optional `from` and `to` query parameters in `YYYY-MM-DD` format, use inclusive UTC calendar days, default to the most recent 30 days, and reject ranges longer than 366 days.

- **Revenue:** Sum of `totalAmount` for orders whose status is `PAID` and whose creation time falls in the selected range. Each order is selected once, so repeated payment events cannot double-count it.
- **Paid orders:** Number of `PAID` orders in the range.
- **Total orders:** Number of orders of every status in the range.
- **Conversion rate:** Paid orders divided by total orders, multiplied by 100. Empty ranges return zero.
- **New customers:** Customer profiles created in the range.
- **Daily sales:** Paid-order count and revenue grouped by UTC creation date.

Endpoints:

- `GET /api/analytics/dashboard` returns the complete metric summary and daily series.
- `GET /api/analytics/sales` returns revenue, paid-order count, and the daily sales series.
