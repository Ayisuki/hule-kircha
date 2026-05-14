# ሁሌ ቅርጫ (Hule Kircha)

**A Premium Ethiopian Digital Kircha & Livestock Commerce Mini App for Telebirr**

---

## 🐂 Product Vision

ሁሌ ቅርጫ is a production-grade fintech-commerce platform focused on:
- Digital Kircha participation
- Livestock ordering (በሬ, በግ, ፍየል, ቋንጣ)
- Group kircha coordination
- Transparent order management
- Telebirr payment integration

---

## 🏗️ Tech Stack

### Frontend (Mini App)
- React 18 + Vite
- TailwindCSS
- React Router DOM
- Axios
- React Query (TanStack Query)
- Zustand (State Management)
- Framer Motion (Animations)

### Backend
- Node.js + Express.js
- MongoDB Atlas + Mongoose
- JWT Authentication
- bcrypt
- Helmet, CORS, Rate Limiting
- Telebirr Payment Integration

### Admin Panel
- React 18 + Vite
- TailwindCSS
- React Router DOM
- Axios
- Recharts (Analytics)

---

## 📁 Project Structure

```
root/
├── frontend/          # Telebirr Mini App (React + Vite)
├── backend/           # Express.js API Server
├── admin/             # Admin Dashboard (React + Vite)
├── shared/            # Shared types & utilities
├── assets/            # Brand assets (logo, icons)
└── README.md
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB Atlas account
- Telebirr Merchant API credentials

### 1. Backend Setup
```bash
cd backend
npm install
# Create .env file (see backend/.env.example)
npm run dev
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### 3. Admin Panel Setup
```bash
cd admin
npm install
npm run dev
```

---

## 🌐 Deployment

| Service | Platform | URL |
|---------|----------|-----|
| Frontend | Vercel | https://hule-kircha.vercel.app |
| Backend | Render / Railway | https://hule-kircha-api.onrender.com |
| Database | MongoDB Atlas | mongodb+srv://... |
| Admin | Vercel | https://hule-kircha-admin.vercel.app |

---

## 📱 Mini App Integration

Register the app in the Telebirr Mini App Developer Portal with:
- **App ID**: `hule-kircha-livestock`
- **Entry URL**: `https://hule-kircha.vercel.app`
- **Callback URL**: `https://hule-kircha-api.onrender.com/api/orders/callback`

---

## 🔐 Security

- JWT-based authentication
- bcrypt PIN hashing
- Rate limiting on all API routes
- Helmet security headers
- CORS configuration
- Backend-only payment validation
- Signature verification for Telebirr callbacks

---

## 🎨 Theme System

- **Dark Mode** (default): Luxury black/gold fintech aesthetic
- **Light Mode**: Premium Ethiopian commerce aesthetic
- Animated toggle with localStorage persistence
- Smooth CSS transitions with no flicker

---

## 📝 License

Proprietary - Hule Kircha Trading PLC

---

## 👥 Team

Built by elite full-stack engineers for the Ethiopian fintech market.

**"ሁሌ ቅርጫ — Premium Livestock, Premium Service"**
