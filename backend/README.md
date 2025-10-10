# Evo-Tech Backend

Laravel 11 API for the Evo-Tech Bangladesh e-commerce platform.

## Features

- RESTful API for product management
- User authentication with Laravel Sanctum
- Admin panel for managing products, orders, categories
- Order processing and cart management
- Landing page content management
- JWT token authentication
- Queue system for background jobs

## Requirements

- PHP 8.2 or higher
- Composer
- Node.js and npm (for Vite)
- MySQL or PostgreSQL database

## Installation

1. Clone the repository and navigate to backend directory:
   ```bash
   cd backend
   ```

2. Install PHP dependencies:
   ```bash
   composer install
   ```

3. Install Node.js dependencies:
   ```bash
   npm install
   ```

4. Copy environment file:
   ```bash
   cp .env.example .env
   ```

5. Generate application key:
   ```bash
   php artisan key:generate
   ```

6. Configure your database in `.env` file

7. Run database migrations:
   ```bash
   php artisan migrate
   ```

8. (Optional) Seed the database:
   ```bash
   php artisan db:seed
   ```

## Running the Application

### Development Mode
Run all services concurrently:
```bash
composer run dev
```

This will start:
- Laravel server on http://localhost:8000
- Queue worker
- Log tailing
- Vite dev server for assets

### Manual Startup
- Start Laravel server: `php artisan serve`
- Start queue worker: `php artisan queue:work`
- Build assets: `npm run dev`

## API Documentation

### Authentication
- `POST /api/signin-user` - User login
- `POST /api/signup-user` - User registration

### Products
- `GET /api/items/category/{category}` - Get products by category
- `GET /api/items/item/{itemSlug}` - Get specific product

### Cart
- `GET /api/cart` - Get user's cart
- `POST /api/cart/add` - Add item to cart

### Orders
- `POST /api/order/place` - Place new order
- `GET /api/order/{orderId}` - Get order details

### Admin Routes (prefix: `/api/admin`)
- Products management
- Categories, subcategories, brands
- Orders management
- Landing page content

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
