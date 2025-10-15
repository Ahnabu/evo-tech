# 🚀 Quick Start Guide

## Setup in 3 Minutes

### 1. Environment Setup

```bash
cd backend-node
cp .env.example .env
```

Edit `.env` file:

```env
# MongoDB
DB_URL=mongodb://localhost:27017/evotech

# JWT Secrets (change these!)
JWT_ACCESS_SECRET=your-super-secret-access-key-change-this
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-this

# Admin Account (auto-created)
ADMIN_EMAIL=admin@evotech.com
ADMIN_PASSWORD=Admin@123456

# Cloudinary (get free account at cloudinary.com)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# CORS
CORS_ORIGIN=http://localhost:3000
```

### 2. Install & Run

```bash
npm install
npm run dev
```

Server starts at: `http://localhost:5000`

### 3. Test with Postman

**Import Collection:**

1. Open Postman
2. Click Import
3. Select `Evo-Tech_API_Collection.postman_collection.json`

**Test Flow:**

1. Run "Login Admin" → Token saved automatically
2. Run "Create Category" → Category created
3. Run "Create Product" → Product created
4. Run "Register User" → User registered, new token saved
5. Run "Add to Cart" → Product added to cart
6. Run "Place Order" → Order created from cart

**Done!** All APIs working ✅

---

## 📁 Files You Need

### For Testing:

- `Evo-Tech_API_Collection.postman_collection.json` - Import to Postman
- `API_DOCUMENTATION.md` - Complete API reference

### For Understanding:

- `IMPLEMENTATION_COMPLETE.md` - What was implemented
- `IMPLEMENTATION_GUIDE.md` - How to extend the backend

---

## 🔥 Key Endpoints

### Public (No Auth):

```
GET  /api/v1/categories
GET  /api/v1/brands
GET  /api/v1/products
POST /api/v1/auth/register
POST /api/v1/auth/login
```

### User (Auth Required):

```
GET  /api/v1/shopping/cart
POST /api/v1/shopping/cart
POST /api/v1/orders
GET  /api/v1/orders/my-orders
```

### Admin (Admin Auth Required):

```
POST /api/v1/categories
POST /api/v1/products
GET  /api/v1/orders (all orders)
PUT  /api/v1/orders/:id (update status)
```

---

## 🎯 Testing Checklist

- [ ] Server starts without errors
- [ ] Login admin works
- [ ] Create category works
- [ ] Create product works
- [ ] Register user works
- [ ] Add to cart works
- [ ] Place order works
- [ ] View orders works

---

## 🐛 Troubleshooting

**Server won't start:**

- Check MongoDB is running
- Check port 5000 is free
- Run `npm install` again

**Auth errors:**

- Login again to get fresh token
- Token expires after 7 days

**Database errors:**

- Start MongoDB: `mongod` or service
- Check DB_URL in .env

**File upload fails:**

- Get Cloudinary account (free tier)
- Add credentials to .env
- File size must be < 5MB

---

## 📞 Quick Help

**Check if server is running:**

```bash
curl http://localhost:5000/api/v1/categories
```

**Check MongoDB connection:**

```bash
mongo
> show dbs
> use evotech
> show collections
```

**View server logs:**
Server logs appear in terminal where you ran `npm run dev`

---

## ✅ What's Working

- ✅ User authentication (register, login, JWT)
- ✅ Category, Brand, Subcategory management
- ✅ Product management (with images, features, specs)
- ✅ Shopping cart & wishlist
- ✅ Order placement & management
- ✅ Admin controls
- ✅ File uploads (Cloudinary)
- ✅ Advanced filtering & search
- ✅ Pagination
- ✅ Role-based access control

---

## 🎊 You're Ready!

Your backend is fully functional. Start testing with Postman or integrate with your frontend!

**Happy Coding! 🚀**
