# PINREKI AI - API Documentation

Complete API reference for PINREKI AI endpoints.

---

## Base URL

```
Development: http://localhost:3000/api
Production: https://your-domain.com/api
```

## Authentication

Most endpoints require a JWT token in the Authorization header:

```bash
Authorization: Bearer YOUR_JWT_TOKEN
```

Tokens are obtained after login and stored in cookies.

---

## Authentication Endpoints

### Register (Create Account)

**Endpoint:** `POST /auth/register`

**Request:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePassword123",
  "passwordConfirm": "SecurePassword123"
}
```

**Response (201):**
```json
{
  "message": "User created successfully",
  "user": {
    "id": "user_123",
    "email": "john@example.com",
    "name": "John Doe"
  }
}
```

**Error (400):**
```json
{
  "error": "Email already exists"
}
```

---

### Login

**Endpoint:** `POST /auth/login`

**Request:**
```json
{
  "email": "john@example.com",
  "password": "SecurePassword123"
}
```

**Response (200):**
```json
{
  "message": "Login successful",
  "user": {
    "id": "user_123",
    "email": "john@example.com",
    "name": "John Doe"
  },
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Error (401):**
```json
{
  "error": "Invalid credentials"
}
```

---

### Get Current User

**Endpoint:** `GET /auth/me`

**Headers:**
```
Authorization: Bearer YOUR_TOKEN
```

**Response (200):**
```json
{
  "user": {
    "id": "user_123",
    "email": "john@example.com",
    "name": "John Doe",
    "createdAt": "2024-01-01T10:00:00Z"
  }
}
```

---

## Product Endpoints

### Get All Products

**Endpoint:** `GET /products`

**Query Parameters:**
- `search`: Search by name/description
- `category`: Filter by category
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)

**Example:**
```
GET /products?category=templates&search=notion&page=1
```

**Response (200):**
```json
{
  "products": [
    {
      "id": "prod_123",
      "name": "Notion Dashboard",
      "slug": "notion-dashboard",
      "price": 2999,
      "salePrice": 1999,
      "description": "Complete Notion setup...",
      "productImage": "https://...",
      "category": "templates",
      "createdAt": "2024-01-01T10:00:00Z"
    }
  ],
  "total": 45,
  "page": 1,
  "totalPages": 5
}
```

---

### Get Single Product

**Endpoint:** `GET /products/[slug]`

**Example:**
```
GET /products/notion-dashboard
```

**Response (200):**
```json
{
  "product": {
    "id": "prod_123",
    "name": "Notion Dashboard",
    "slug": "notion-dashboard",
    "price": 2999,
    "salePrice": 1999,
    "description": "Complete Notion dashboard setup...",
    "longDescription": "This comprehensive guide...",
    "productImage": "https://...",
    "category": "templates",
    "downloadUrl": "https://..."
  }
}
```

---

### Get Categories

**Endpoint:** `GET /products/categories`

**Response (200):**
```json
{
  "categories": [
    {
      "id": "cat_1",
      "name": "Templates",
      "description": "Pre-built templates"
    },
    {
      "id": "cat_2",
      "name": "Courses",
      "description": "Online courses"
    }
  ]
}
```

---

## Order Endpoints

### Create Order

**Endpoint:** `POST /orders/create`

**Headers:**
```
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json
```

**Request:**
```json
{
  "items": [
    {
      "productId": "prod_123",
      "quantity": 1
    }
  ],
  "discountCode": "WELCOME10"
}
```

**Response (201):**
```json
{
  "order": {
    "id": "order_123",
    "orderNumber": "ORD-2024-001",
    "totalAmount": 1999,
    "status": "PENDING"
  },
  "razorpayOrder": {
    "id": "order_razorpay_123",
    "amount": 199900,
    "currency": "INR"
  }
}
```

---

### Verify Payment

**Endpoint:** `POST /orders/verify-payment`

**Request:**
```json
{
  "razorpayOrderId": "order_razorpay_123",
  "razorpayPaymentId": "pay_123",
  "razorpaySignature": "signature_hash"
}
```

**Response (200):**
```json
{
  "message": "Payment successful",
  "order": {
    "id": "order_123",
    "orderNumber": "ORD-2024-001",
    "status": "PAID"
  }
}
```

---

### Get Order Details

**Endpoint:** `GET /orders/[orderId]`

**Headers:**
```
Authorization: Bearer YOUR_TOKEN
```

**Response (200):**
```json
{
  "order": {
    "id": "order_123",
    "orderNumber": "ORD-2024-001",
    "totalAmount": 1999,
    "status": "PAID",
    "items": [
      {
        "productId": "prod_123",
        "name": "Notion Dashboard",
        "quantity": 1,
        "price": 1999
      }
    ],
    "createdAt": "2024-01-01T10:00:00Z"
  }
}
```

---

### Get User Orders

**Endpoint:** `GET /orders/user/[userId]`

**Headers:**
```
Authorization: Bearer YOUR_TOKEN
```

**Response (200):**
```json
{
  "orders": [
    {
      "id": "order_123",
      "orderNumber": "ORD-2024-001",
      "totalAmount": 1999,
      "status": "PAID",
      "createdAt": "2024-01-01T10:00:00Z"
    },
    {
      "id": "order_124",
      "orderNumber": "ORD-2024-002",
      "totalAmount": 4999,
      "status": "PENDING",
      "createdAt": "2024-01-02T10:00:00Z"
    }
  ]
}
```

---

## Analytics Endpoints

### Dashboard Metrics

**Endpoint:** `GET /analytics/dashboard`

**Headers:**
```
Authorization: Bearer YOUR_TOKEN
```

**Response (200):**
```json
{
  "metrics": {
    "totalRevenue": 100000,
    "totalOrders": 45,
    "totalCustomers": 38,
    "averageOrderValue": 2222,
    "conversionRate": 3.5
  },
  "revenueByDay": [
    {
      "date": "2024-01-01",
      "revenue": 5000
    }
  ],
  "topProducts": [
    {
      "name": "Notion Dashboard",
      "sales": 25,
      "revenue": 49975
    }
  ]
}
```

---

### Sales Data

**Endpoint:** `GET /analytics/sales`

**Query Parameters:**
- `startDate`: Start date (YYYY-MM-DD)
- `endDate`: End date (YYYY-MM-DD)
- `groupBy`: Group by day/week/month

**Response (200):**
```json
{
  "sales": [
    {
      "date": "2024-01-01",
      "orders": 5,
      "revenue": 5000,
      "customers": 4
    }
  ]
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "error": "Invalid request data",
  "details": "Email is required"
}
```

### 401 Unauthorized
```json
{
  "error": "Not authenticated"
}
```

### 403 Forbidden
```json
{
  "error": "Access denied"
}
```

### 404 Not Found
```json
{
  "error": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error"
}
```

---

## Rate Limiting

API requests are limited to:
- **Authenticated users**: 100 requests per minute
- **Unauthenticated users**: 20 requests per minute

---

## Example Usage

### Using cURL

```bash
# Register
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John",
    "email": "john@example.com",
    "password": "SecurePass123",
    "passwordConfirm": "SecurePass123"
  }'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePass123"
  }'

# Get products
curl http://localhost:3000/api/products?category=templates
```

### Using JavaScript Fetch

```javascript
// Register
const response = await fetch('/api/auth/register', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    name: 'John',
    email: 'john@example.com',
    password: 'SecurePass123',
    passwordConfirm: 'SecurePass123'
  })
});

const data = await response.json();
console.log(data);
```

### Using Axios

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: '/api'
});

// Login
const response = await api.post('/auth/login', {
  email: 'john@example.com',
  password: 'SecurePass123'
});

// Set token for future requests
api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;

// Get products
const products = await api.get('/products?category=templates');
```

---

## Webhooks

### Razorpay Payment Webhook

**Event:** Payment successful

**Endpoint:** `POST /webhooks/razorpay`

**Payload:**
```json
{
  "event": "payment.authorized",
  "payload": {
    "payment": {
      "entity": {
        "id": "pay_123",
        "order_id": "order_123",
        "status": "captured",
        "amount": 199900
      }
    }
  }
}
```

---

## SDK Availability

- **JavaScript/TypeScript**: Built-in Fetch/Axios
- **Python**: `requests` library
- **Node.js**: `axios` or `node-fetch`
- **PHP**: `curl` or `GuzzleHttp`
- **Ruby**: `rest-client` or `httparty`

---

## Support

For API issues:
- 📧 Email: api-support@pinreki.ai
- 📖 Docs: https://docs.pinreki.ai
- 💬 Discord: https://discord.gg/pinrekiai
