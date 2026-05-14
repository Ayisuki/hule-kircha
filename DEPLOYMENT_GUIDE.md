# Hule Kircha - Deployment Guide

## Prerequisites
- Node.js 18+
- MongoDB Atlas account
- GitHub account
- Vercel account (free)
- Render or Railway account (free)
- Telebirr Merchant API credentials

---

## 1. Backend Deployment (Render)

### Step 1: Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/hule-kircha.git
git push -u origin main
```

### Step 2: Create Render Web Service
1. Go to [render.com](https://render.com) and sign in
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: hule-kircha-api
   - **Environment**: Node
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `cd backend && npm start`
   - **Plan**: Free

### Step 3: Environment Variables
Add these in Render Dashboard → Environment:
```
NODE_ENV=production
PORT=10000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/hulekircha
JWT_SECRET=your-super-secret-key-min-32-chars
JWT_EXPIRES_IN=7d
TELEBIRR_APP_ID=your-app-id
TELEBIRR_APP_KEY=your-app-key
TELEBIRR_MERCHANT_CODE=your-merchant-code
TELEBIRR_NOTIFY_URL=https://hule-kircha-api.onrender.com/api/orders/callback
TELEBIRR_RETURN_URL=https://hule-kircha.vercel.app/payment/success
TELEBIRR_TIMEOUT_URL=https://hule-kircha.vercel.app/payment/timeout
TELEBIRR_API_URL=https://app.ethiotelecom.et/telebirrApi
```

### Step 4: Deploy
Click "Deploy" and wait for the build to complete.

---

## 2. Frontend Deployment (Vercel)

### Step 1: Configure Environment
Edit `frontend/.env.production`:
```
VITE_API_URL=https://hule-kircha-api.onrender.com/api
```

### Step 2: Deploy to Vercel
```bash
cd frontend
npm install -g vercel
vercel --prod
```

Or use GitHub integration:
1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Add Environment Variable: `VITE_API_URL`
5. Deploy

---

## 3. Admin Panel Deployment (Vercel)

### Step 1: Configure Environment
Edit `admin/.env.production`:
```
VITE_API_URL=https://hule-kircha-api.onrender.com/api
```

### Step 2: Deploy
```bash
cd admin
vercel --prod
```

Or configure as a separate Vercel project with:
- **Root Directory**: `admin`
- **Framework Preset**: Vite

---

## 4. MongoDB Atlas Setup

1. Go to [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas)
2. Create a free cluster (M0)
3. Create a database user
4. Add IP whitelist (0.0.0.0/0 for all IPs, or restrict to Render's IPs)
5. Get connection string and add to backend env vars

### Seed Database
```bash
cd backend
npm install
# Create .env with MONGODB_URI
npm run seed
```

---

## 5. Telebirr Integration

1. Register as a Telebirr merchant
2. Get App ID, App Key, and Merchant Code
3. Configure callback URLs in Telebirr dashboard:
   - Notify URL: `https://your-api.com/api/orders/callback`
   - Return URL: `https://your-frontend.com/payment/success`
4. Test with sandbox environment first

---

## 6. Telebirr Mini App Registration

1. Go to Telebirr Mini App Developer Portal
2. Register new app:
   - **App ID**: `hule-kircha-livestock`
   - **App Name**: ሁሌ ቅርጫ
   - **Entry URL**: `https://hule-kircha.vercel.app`
   - **Callback URL**: `https://hule-kircha-api.onrender.com/api/orders/callback`
3. Submit for review
4. After approval, app will be available in Telebirr Mini Apps section

---

## 7. Domain & SSL

### Custom Domain (Optional)
1. Purchase domain (e.g., hulekircha.com)
2. Add to Vercel:
   - Go to Project Settings → Domains
   - Add your domain
   - Update DNS records
3. Add to Render:
   - Go to Settings → Custom Domains
   - Add your API subdomain (api.hulekircha.com)

### SSL
- Vercel and Render provide free SSL automatically
- No additional configuration needed

---

## 8. Monitoring & Logs

### Render Logs
- Dashboard → Web Service → Logs
- Real-time log streaming

### Vercel Analytics
- Dashboard → Project → Analytics
- Performance metrics and insights

### MongoDB Atlas Monitoring
- Dashboard → Metrics
- Database performance and alerts

---

## 9. Backup Strategy

### MongoDB Atlas
- Enable automated backups (M2+ clusters)
- Or export manually: `mongodump --uri="your-connection-string"`

### Code
- GitHub provides version control
- Tag releases: `git tag -a v1.0.0 -m "Production release"`

---

## 10. Scaling

### Vertical Scaling
- Render: Upgrade to paid plan for more RAM/CPU
- Vercel: Pro plan for more bandwidth

### Horizontal Scaling
- Render supports auto-scaling on paid plans
- MongoDB Atlas: Upgrade to M10+ for replica sets

---

## Quick Reference

| Service | URL Pattern |
|---------|-------------|
| Frontend | https://hule-kircha.vercel.app |
| Admin | https://hule-kircha-admin.vercel.app |
| API | https://hule-kircha-api.onrender.com |
| Health Check | /health |

---

## Troubleshooting

### CORS Errors
Ensure backend CORS allows your frontend domain:
```javascript
app.use(cors({
  origin: ["https://hule-kircha.vercel.app", "https://hule-kircha-admin.vercel.app"]
}));
```

### Build Failures
- Check Node.js version (must be 18+)
- Verify all dependencies in package.json
- Check for missing environment variables

### Database Connection Issues
- Verify MongoDB URI format
- Check IP whitelist settings
- Ensure database user has correct permissions

---

**"ሁሌ ቅርጫ — Premium Livestock, Premium Service"**
