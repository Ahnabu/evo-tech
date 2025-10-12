# Evo-Tech Backend (Node.js/Express)

Node.js/Express API for the Evo-Tech Bangladesh e-commerce platform.

## Features

### Core Features
- RESTful API with TypeScript
- JWT authentication with refresh tokens
- Role-based access control (Admin, Employee, User)
- Comprehensive product management
- Advanced order processing
- Real-time notifications with Socket.io
- File upload handling
- Email notifications
- Caching with Redis
- Comprehensive logging

### New E-commerce Features
- **Inventory Management**: Real-time stock tracking, low stock alerts, automatic stock updates
- **Pre-order System**: Special pricing for pre-orders, release date management
- **Advanced Search**: Full-text search, filters, sorting, pagination
- **Product Management**: Categories, subcategories, brands, variants, specifications
- **Order Management**: Status tracking, invoice generation, shipping calculations
- **User Management**: Role-based permissions, profile management, address book
- **Analytics**: Sales reports, user activity, inventory reports
- **Content Management**: Landing page sections, carousels, featured content

## Requirements

- Node.js 20+
- npm or yarn
- MongoDB 6+
- Redis (optional, for caching)

## Project Structure

```
backend/
├── src/
│   ├── controllers/          # Route controllers
│   │   ├── auth/            # Authentication controllers
│   │   ├── admin/           # Admin-only controllers
│   │   ├── products/        # Product management
│   │   ├── orders/          # Order management
│   │   └── users/           # User management
│   ├── middleware/          # Custom middleware
│   │   ├── auth.ts          # JWT authentication
│   │   ├── rbac.ts          # Role-based access control
│   │   └── validation.ts    # Request validation
│   ├── models/              # MongoDB models
│   │   ├── User.ts          # User model
│   │   ├── Product.ts       # Product model
│   │   ├── Order.ts         # Order model
│   │   └── ...             # Other models
│   ├── routes/              # API routes
│   │   ├── auth.ts          # Authentication routes
│   │   ├── admin.ts         # Admin routes
│   │   ├── products.ts      # Product routes
│   │   └── ...             # Other routes
│   ├── services/            # Business logic
│   │   ├── authService.ts   # Authentication service
│   │   ├── productService.ts # Product service
│   │   └── ...             # Other services
│   ├── utils/               # Utility functions
│   │   ├── database.ts      # Database connection
│   │   ├── email.ts         # Email service
│   │   └── ...             # Other utilities
│   ├── config/              # Configuration files
│   └── types/               # TypeScript type definitions
├── uploads/                 # File uploads directory
├── package.json
├── tsconfig.json
└── .env.example
```

## Installation

1. Navigate to backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy environment file:
   ```bash
   cp .env.example .env
   ```

4. Configure environment variables in `.env`:
   ```
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/evotech
   JWT_SECRET=your-jwt-secret
   JWT_REFRESH_SECRET=your-refresh-secret
   REDIS_URL=redis://localhost:6379
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   ```

5. Start MongoDB service

6. (Optional) Start Redis service for caching

## Running the Application

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm run build
npm start
```

### Available Scripts
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server
- `npm run test` - Run tests
- `npm run lint` - Run ESLint

## API Documentation

### Authentication Routes
```
POST   /api/auth/register           # User registration
POST   /api/auth/login              # User login
POST   /api/auth/refresh            # Refresh JWT token
POST   /api/auth/logout             # User logout
POST   /api/auth/forgot-password    # Forgot password
POST   /api/auth/reset-password     # Reset password
POST   /api/auth/oauth/google       # Google OAuth
POST   /api/auth/oauth/facebook     # Facebook OAuth
```

### User Routes
```
GET    /api/users/profile           # Get user profile
PUT    /api/users/profile           # Update user profile
GET    /api/users/addresses         # Get user addresses
POST   /api/users/addresses         # Add new address
PUT    /api/users/addresses/:id     # Update address
DELETE /api/users/addresses/:id     # Delete address
```

### Product Routes
```
GET    /api/products                # Get all products (with filters)
GET    /api/products/search         # Search products
GET    /api/products/:id            # Get product by ID
GET    /api/products/slug/:slug     # Get product by slug
GET    /api/products/category/:cat  # Get products by category
GET    /api/products/:id/reviews    # Get product reviews
POST   /api/products/:id/reviews    # Add product review
```

### Cart Routes
```
GET    /api/cart                    # Get user's cart
POST   /api/cart/add                # Add item to cart
PUT    /api/cart/update/:id         # Update cart item
DELETE /api/cart/remove/:id         # Remove cart item
DELETE /api/cart/clear              # Clear entire cart
```

### Wishlist Routes
```
GET    /api/wishlist               # Get user's wishlist
POST   /api/wishlist/add           # Add item to wishlist
DELETE /api/wishlist/remove/:id    # Remove from wishlist
```

### Order Routes
```
GET    /api/orders                 # Get user's orders
POST   /api/orders                 # Create new order
GET    /api/orders/:id             # Get order details
PUT    /api/orders/:id/cancel      # Cancel order
```

### Admin Routes (Role: Admin/Employee)
```
# User Management
GET    /api/admin/users            # Get all users
GET    /api/admin/users/:id        # Get user details
PUT    /api/admin/users/:id        # Update user
DELETE /api/admin/users/:id        # Delete user

# Product Management
GET    /api/admin/products         # Get all products
POST   /api/admin/products         # Create product
PUT    /api/admin/products/:id     # Update product
DELETE /api/admin/products/:id     # Delete product
POST   /api/admin/products/bulk    # Bulk operations

# Category Management
GET    /api/admin/categories       # Get all categories
POST   /api/admin/categories       # Create category
PUT    /api/admin/categories/:id   # Update category
DELETE /api/admin/categories/:id   # Delete category

# Order Management
GET    /api/admin/orders           # Get all orders
PUT    /api/admin/orders/:id       # Update order status
DELETE /api/admin/orders/:id       # Delete order
GET    /api/admin/orders/analytics # Order analytics

# Inventory Management
GET    /api/admin/inventory        # Get inventory status
PUT    /api/admin/inventory/:id    # Update stock
GET    /api/admin/inventory/low    # Get low stock items

# Analytics
GET    /api/admin/analytics/sales  # Sales analytics
GET    /api/admin/analytics/users  # User analytics
GET    /api/admin/analytics/products # Product analytics
```

### Super Admin Routes (Role: Admin only)
```
GET    /api/admin/employees        # Get all employees
POST   /api/admin/employees        # Create employee
PUT    /api/admin/employees/:id    # Update employee
DELETE /api/admin/employees/:id    # Delete employee
```

## Testing

Run PHPUnit tests:
```bash
php artisan test
```

## Environment Variables

Key environment variables to configure:
- `APP_NAME` - Application name
- `APP_ENV` - Environment (local/production)
- `APP_KEY` - Application key
- `DB_CONNECTION` - Database connection
- `DB_HOST`, `DB_PORT`, `DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD` - Database config
- `QUEUE_CONNECTION` - Queue driver

## License

MIT License
