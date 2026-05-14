# Hule Kircha API Documentation

## Base URL
```
Development: http://localhost:5000/api
Production:  https://your-api-domain.com/api
```

## Authentication
All protected endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <jwt_token>
```

---

## Auth Endpoints

### POST /api/auth/login
Login or register with phone + PIN.

**Request Body:**
```json
{
  "phone": "+251911234567",
  "pin": "1234",
  "name": "John Doe"  // Required only for new registration
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": { ... },
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

### POST /api/auth/telebirr
Login with Telebirr profile.

**Request Body:**
```json
{
  "telebirrId": "TB123456",
  "phone": "+251911234567",
  "name": "John Doe"
}
```

### POST /api/auth/forgot-pin
Reset PIN.

**Request Body:**
```json
{
  "phone": "+251911234567",
  "newPin": "5678"
}
```

### GET /api/auth/me
Get current user profile.

### PUT /api/auth/profile
Update user profile.

**Request Body:**
```json
{
  "name": "New Name",
  "preferredTheme": "light"
}
```

---

## Product Endpoints

### GET /api/products
Get all products.

**Query Parameters:**
- `category` - Filter by category
- `search` - Text search
- `isAvailable` - true/false
- `featured` - true/false

### GET /api/products/:id
Get single product by ID.

---

## Order Endpoints

### POST /api/orders/checkout
Create order and initiate payment.

**Request Body:**
```json
{
  "items": [
    {
      "productId": "...",
      "quantity": 2
    }
  ],
  "deliveryAddress": "Addis Ababa, Bole",
  "deliveryPhone": "+251911234567",
  "notes": "Optional notes"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "order": { ... },
    "paymentUrl": "https://telebirr..."
  }
}
```

### POST /api/orders/callback
Telebirr payment callback (backend only).

### GET /api/orders/my-orders
Get user's order history.

### GET /api/orders/:id
Get order details.

---

## Admin Endpoints

All admin endpoints require authentication + admin role.

### GET /api/admin/dashboard
Get dashboard analytics.

**Response:**
```json
{
  "success": true,
  "data": {
    "stats": {
      "totalUsers": 100,
      "totalOrders": 50,
      "paidOrders": 40,
      "pendingOrders": 10,
      "deliveredOrders": 30,
      "totalRevenue": 500000
    },
    "recentOrders": [...],
    "monthlyRevenue": [...],
    "categoryStats": [...]
  }
}
```

### GET /api/admin/orders
Get all orders (paginated).

**Query Parameters:**
- `status` - Filter by status
- `search` - Search by reference or item name
- `page` - Page number
- `limit` - Items per page

### PUT /api/admin/orders/:id
Update order status.

**Request Body:**
```json
{
  "status": "delivered"
}
```

### GET /api/admin/users
Get all users (paginated).

### PUT /api/admin/users/:id
Toggle user active status.

### GET /api/admin/payments
Get payment summary.

### POST /api/admin/products
Create new product.

**Request Body:**
```json
{
  "name": "Product Name",
  "description": "Description",
  "category": "የበሬ ቅርጫ",
  "subCategory": "full",
  "price": 25000,
  "deliveryFee": 350,
  "stock": 50,
  "minOrderQty": 1,
  "maxOrderQty": 10,
  "isAvailable": true,
  "featured": false
}
```

### PUT /api/admin/products/:id
Update product.

### DELETE /api/admin/products/:id
Delete product.

---

## Error Responses

```json
{
  "success": false,
  "message": "Error description"
}
```

**Status Codes:**
- 200 - Success
- 201 - Created
- 400 - Bad Request
- 401 - Unauthorized
- 403 - Forbidden
- 404 - Not Found
- 429 - Too Many Requests
- 500 - Server Error

---

## Rate Limits
- General API: 100 requests per 15 minutes
- Auth endpoints: 10 requests per 15 minutes
