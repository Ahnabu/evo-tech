# Evo-Tech E-commerce API Documentation

Complete REST API documentation for the Evo-Tech E-commerce backend built with Node.js, Express, TypeScript, and MongoDB.

## 📦 Postman Collection

Import the Postman collection file: `Evo-Tech_API_Collection.postman_collection.json`

### How to Import:

1. Open Postman
2. Click "Import" button (top left)
3. Select the `Evo-Tech_API_Collection.postman_collection.json` file
4. Collection will be imported with all endpoints ready to test

### Collection Features:

- ✅ Pre-configured base URL variable
- ✅ Automatic token management (saves accessToken after login)
- ✅ All CRUD operations for every module
- ✅ Test scripts to save IDs for chaining requests
- ✅ Bearer token authentication
- ✅ Form-data support for file uploads

## 🚀 Base URL

```
http://localhost:5000/api/v1
```

## 🔐 Authentication

Most endpoints require authentication. Include the access token in the Authorization header:

```
Authorization: Bearer <your_access_token>
```

### Admin Credentials (Default)

```
Email: admin@evotech.com
Password: Admin@123456
```

## 📚 API Endpoints Overview

### Authentication (`/auth`)

- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `POST /auth/oauth` - OAuth login (Google/Facebook)
- `POST /auth/logout` - Logout user

### Users (`/users`)

- `GET /users` - Get all users (Admin only)
- `GET /users/:id` - Get single user
- `PUT /users/:id` - Update user
- `DELETE /users/:id` - Delete user (Admin only)

### Categories (`/categories`)

- `GET /categories` - Get all categories
- `GET /categories/:id` - Get category by ID
- `GET /categories/slug/:slug` - Get category by slug
- `POST /categories` - Create category (Admin only)
- `PUT /categories/:id` - Update category (Admin only)
- `DELETE /categories/:id` - Delete category (Admin only)

### Brands (`/brands`)

- `GET /brands` - Get all brands
- `GET /brands/:id` - Get brand by ID
- `GET /brands/slug/:slug` - Get brand by slug
- `POST /brands` - Create brand (Admin only)
- `PUT /brands/:id` - Update brand (Admin only)
- `DELETE /brands/:id` - Delete brand (Admin only)

### Subcategories (`/subcategories`)

- `GET /subcategories` - Get all subcategories
- `GET /subcategories/:id` - Get subcategory by ID
- `GET /subcategories/slug/:slug` - Get subcategory by slug
- `POST /subcategories` - Create subcategory (Admin only)
- `PUT /subcategories/:id` - Update subcategory (Admin only)
- `DELETE /subcategories/:id` - Delete subcategory (Admin only)

### Products (`/products`)

- `GET /products` - Get all products with filters
- `GET /products/:id` - Get product by ID
- `GET /products/slug/:slug` - Get product by slug
- `POST /products` - Create product (Admin only)
- `PUT /products/:id` - Update product (Admin only)
- `DELETE /products/:id` - Delete product (Admin only)

#### Product Images

- `POST /products/:productId/images` - Add product image (Admin only)
- `DELETE /products/images/:imageId` - Delete product image (Admin only)

#### Product Features

- `POST /products/:productId/feature-headers` - Add feature header (Admin only)
- `PUT /products/feature-headers/:headerId` - Update feature header (Admin only)
- `DELETE /products/feature-headers/:headerId` - Delete feature header (Admin only)
- `POST /products/:productId/feature-subsections` - Add feature subsection (Admin only)
- `PUT /products/feature-subsections/:subsectionId` - Update feature subsection (Admin only)
- `DELETE /products/feature-subsections/:subsectionId` - Delete feature subsection (Admin only)

#### Product Specifications

- `POST /products/:productId/specifications` - Add specification (Admin only)
- `PUT /products/specifications/:specId` - Update specification (Admin only)
- `DELETE /products/specifications/:specId` - Delete specification (Admin only)

### Cart & Wishlist (`/shopping`)

- `GET /shopping/cart` - Get user's cart
- `POST /shopping/cart` - Add to cart
- `PUT /shopping/cart/:itemId` - Update cart item
- `DELETE /shopping/cart/:itemId` - Remove cart item
- `DELETE /shopping/cart` - Clear cart
- `GET /shopping/wishlist` - Get user's wishlist
- `POST /shopping/wishlist` - Add to wishlist
- `DELETE /shopping/wishlist/:itemId` - Remove from wishlist
- `DELETE /shopping/wishlist` - Clear wishlist

### Orders (`/orders`)

- `POST /orders` - Place order
- `GET /orders/my-orders` - Get current user's orders
- `GET /orders/:id` - Get single order
- `GET /orders` - Get all orders (Admin only)
- `PUT /orders/:id` - Update order status (Admin only)
- `DELETE /orders/:id` - Delete order (Admin only)

## 🔥 Quick Start Guide

### 1. Register a User

```http
POST /api/v1/auth/register
Content-Type: application/json

{
  "firstname": "John",
  "lastname": "Doe",
  "email": "john@example.com",
  "password": "Password123!",
  "phone": "1234567890"
}
```

### 2. Login

```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "Password123!"
}
```

**Response:**

```json
{
  "success": true,
  "message": "User successfully logged in!",
  "data": {
    "user": { ... },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 3. Use Token in Subsequent Requests

```http
GET /api/v1/products
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 📝 Example Requests

### Create Category (with Image)

```http
POST /api/v1/categories
Authorization: Bearer <admin_token>
Content-Type: multipart/form-data

data: {
  "name": "Electronics",
  "description": "Electronic devices and accessories",
  "isActive": true,
  "sortOrder": 1
}
image: <file>
```

### Create Product

```http
POST /api/v1/products
Authorization: Bearer <admin_token>
Content-Type: multipart/form-data

data: {
  "name": "iPhone 15 Pro",
  "price": 999,
  "previousPrice": 1099,
  "inStock": true,
  "category": "65f1b2c3d4e5f6g7h8i9j0k1",
  "description": "Latest iPhone with A17 Pro chip",
  "stock": 50,
  "published": true,
  "features": ["A17 Pro chip", "Titanium design", "USB-C"],
  "colors": ["Natural Titanium", "Blue Titanium", "White Titanium"]
}
mainImage: <file>
```

### Filter Products

```http
GET /api/v1/products?category=65f1b2c3d4e5f6g7h8i9j0k1&minPrice=500&maxPrice=1500&inStock=true&sortBy=price&sortOrder=asc&page=1&limit=10
```

### Add to Cart

```http
POST /api/v1/shopping/cart
Authorization: Bearer <user_token>
Content-Type: application/json

{
  "product": "65f1b2c3d4e5f6g7h8i9j0k1",
  "quantity": 2,
  "selectedColor": "Natural Titanium"
}
```

### Place Order

```http
POST /api/v1/orders
Authorization: Bearer <user_token>
Content-Type: application/json

{
  "firstname": "John",
  "lastname": "Doe",
  "phone": "1234567890",
  "email": "john@example.com",
  "houseStreet": "123 Main St",
  "city": "New York",
  "postcode": "10001",
  "country": "USA",
  "shippingType": "standard",
  "paymentMethod": "card",
  "terms": true,
  "discount": 0,
  "deliveryCharge": 10,
  "additionalCharge": 0
}
```

## 🔍 Query Parameters

### Pagination

- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)

### Search & Filters

- `search` - Search term
- `isActive` - Filter by active status (true/false)
- `category` - Filter by category ID
- `subcategory` - Filter by subcategory ID
- `brand` - Filter by brand ID
- `minPrice` - Minimum price filter
- `maxPrice` - Maximum price filter
- `inStock` - Filter in-stock products (true/false)
- `published` - Filter published products (true/false)
- `isFeatured` - Filter featured products (true/false)

### Sorting

- `sortBy` - Field to sort by (e.g., price, createdAt, name)
- `sortOrder` - Sort direction (asc/desc)

## 📊 Response Format

### Success Response

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Operation successful",
  "data": { ... },
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10
  }
}
```

### Error Response

```json
{
  "success": false,
  "message": "Error message",
  "errorSources": [
    {
      "path": "field_name",
      "message": "Specific error"
    }
  ]
}
```

## 🎯 Common Status Codes

- `200` - OK (Success)
- `201` - Created (Resource created successfully)
- `400` - Bad Request (Invalid input)
- `401` - Unauthorized (Authentication required)
- `403` - Forbidden (No permission)
- `404` - Not Found (Resource not found)
- `409` - Conflict (Duplicate entry)
- `500` - Internal Server Error

## 🛡️ Role-Based Access

### Public Endpoints (No Auth Required)

- GET categories, brands, subcategories, products
- POST register, login, oauth

### User Endpoints (User Auth Required)

- All cart operations
- All wishlist operations
- Place order
- Get my orders
- Get single order (own only)
- Update own profile

### Admin Endpoints (Admin Auth Required)

- Create/Update/Delete categories, brands, subcategories
- Create/Update/Delete products and related data
- Get all users
- Delete users
- Get all orders
- Update order status
- Delete orders

## 🔄 Testing Workflow

### Using Postman Collection:

1. **Login as Admin**

   - Use "Login Admin" request
   - Token will be saved automatically

2. **Create Category**

   - Use "Create Category (Admin)" request
   - CategoryId will be saved automatically

3. **Create Brand**

   - Use "Create Brand (Admin)" request

4. **Create Product**

   - Use "Create Product (Admin)" request
   - ProductId will be saved automatically
   - Use saved categoryId

5. **Register User**

   - Use "Register User" request
   - Token will be saved

6. **Add to Cart**

   - Use "Add to Cart" request
   - Use saved productId

7. **Place Order**

   - Use "Place Order" request
   - OrderId will be saved

8. **View Orders**
   - Use "Get My Orders" request

## 📦 File Upload Notes

When uploading files (images), use `multipart/form-data`:

- Put JSON data in `data` field
- Put file in appropriate field (`image`, `mainImage`, or `logo`)
- The `parseBody` middleware will automatically parse the JSON from `data` field

Example in Postman:

```
Body > form-data
data (text): {"name":"Category Name","description":"Description"}
image (file): [select file]
```

## 🌟 Tips

1. **Save Tokens**: After login, the collection automatically saves the access token
2. **Chain Requests**: Many requests save IDs for use in subsequent requests
3. **Use Variables**: Collection variables can be edited in Postman
4. **Test Admin Features**: Login as admin first to test admin-only endpoints
5. **Clear Cart**: Remember to clear cart before placing a new order if needed

## 🐛 Troubleshooting

### Authentication Issues

- Ensure token is fresh (tokens expire after 7 days)
- Check Authorization header format: `Bearer <token>`
- Login again to get a new token

### File Upload Issues

- Use `multipart/form-data` content type
- Put JSON in `data` field, not as separate fields
- Supported formats: jpeg, jpg, png, gif, webp
- Max file size: 5MB

### 404 Errors

- Check that server is running on port 5000
- Verify the endpoint path is correct
- Ensure MongoDB is connected

## 📞 Support

For issues or questions:

- Check error messages in response
- Review server logs
- Verify environment variables are set correctly
- Ensure MongoDB is running

---

**Happy Testing! 🚀**
