# Evo-Tech Frontend

Next.js 14 frontend application for the Evo-Tech Bangladesh e-commerce platform with comprehensive e-commerce features.

## Features

### Core Features
- Modern React application with TypeScript
- Responsive design with Tailwind CSS
- Role-based authentication (Admin, Employee, User)
- Advanced product browsing with search and filters
- Shopping cart and wishlist functionality
- Comprehensive order management
- SEO optimized with Next.js
- State management with Redux Toolkit
- Real-time notifications

### User Features
- **Product Discovery**: Advanced search, filtering, sorting
- **Shopping Experience**: Cart persistence, wishlist, product comparison
- **Account Management**: Profile, addresses, order history
- **Order Tracking**: Real-time order status updates
- **Reviews & Ratings**: Product reviews and rating system
- **Responsive Design**: Mobile-first responsive design

### Role-Based Dashboards
- **User Dashboard**: Profile, orders, addresses, wishlist
- **Employee Dashboard**: Order management, customer support, inventory viewing
- **Admin Dashboard**: Complete system management, analytics, user management

### Admin Features
- **Product Management**: CRUD operations, bulk actions, inventory tracking
- **Order Management**: Status updates, invoice generation, shipping
- **User Management**: User roles, permissions, account management
- **Analytics**: Sales reports, user activity, performance metrics
- **Content Management**: Landing page, banners, featured products
- **System Settings**: Configuration, email templates, notifications

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Redux Toolkit
- NextAuth.js
- Radix UI components
- Axios for API calls
- React Hook Form with Zod validation

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Backend API running (see backend README)

### Installation

1. Navigate to frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy environment file:
   ```bash
   cp .env.example .env.local
   ```

4. Configure environment variables in `.env.local`:
   ```
   NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
   NEXTAUTH_SECRET=your-secret-key
   NEXTAUTH_URL=http://localhost:3009
   ```

5. Run the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3009](http://localhost:3009) in your browser

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Project Structure

```
frontend/
├── app/                    # Next.js app router pages
│   ├── (admin)/           # Admin dashboard routes
│   │   └── admin/         # Admin pages
│   ├── (employee)/        # Employee dashboard routes
│   │   └── employee/      # Employee pages
│   ├── (user)/            # User dashboard routes
│   │   └── dashboard/     # User dashboard pages
│   ├── (auth)/            # Authentication pages
│   ├── (public)/          # Public pages
│   ├── api/               # API routes
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # Reusable components
│   ├── ui/               # Base UI components
│   ├── admin/            # Admin-specific components
│   ├── employee/         # Employee-specific components
│   ├── user/             # User dashboard components
│   ├── auth/             # Authentication components
│   ├── products/         # Product-related components
│   ├── orders/           # Order-related components
│   ├── search/           # Search components
│   ├── cart/             # Cart components
│   ├── wishlist/         # Wishlist components
│   ├── reviews/          # Review components
│   ├── analytics/        # Analytics components
│   └── common/           # Common components
├── hooks/                # Custom React hooks
│   ├── use-auth.ts       # Authentication hook
│   ├── use-cart.ts       # Cart management hook
│   ├── use-search.ts     # Search functionality hook
│   └── ...              # Other hooks
├── lib/                  # Utility libraries
│   ├── api.ts           # API client configuration
│   ├── auth.ts          # Authentication utilities
│   ├── constants.ts     # Application constants
│   └── ...              # Other utilities
├── store/                # Redux store and slices
│   ├── slices/          # Redux slices
│   │   ├── authSlice.ts # Authentication state
│   │   ├── cartSlice.ts # Cart state
│   │   ├── productSlice.ts # Product state
│   │   └── ...          # Other slices
│   └── store.ts         # Store configuration
├── types/                # TypeScript type definitions
│   ├── auth.ts          # Authentication types
│   ├── product.ts       # Product types
│   ├── order.ts         # Order types
│   └── ...              # Other types
├── utils/                # Helper functions
└── middleware.ts         # Next.js middleware for auth
```

## Page Structure

### Public Pages
- `/` - Home page with featured products and sections
- `/products` - Product listing with search and filters
- `/products/[slug]` - Product detail page
- `/categories/[category]` - Category-based product listing
- `/search` - Advanced search results
- `/cart` - Shopping cart
- `/about` - About page
- `/contact` - Contact page

### Authentication Pages
- `/auth/login` - User login
- `/auth/register` - User registration
- `/auth/forgot-password` - Password reset request
- `/auth/reset-password` - Password reset form

### User Dashboard (Protected Routes)
- `/dashboard` - User dashboard overview
- `/dashboard/profile` - User profile management
- `/dashboard/orders` - Order history
- `/dashboard/addresses` - Address management
- `/dashboard/wishlist` - User wishlist
- `/dashboard/reviews` - User reviews

### Employee Dashboard (Employee Role)
- `/employee/dashboard` - Employee dashboard overview
- `/employee/orders` - Order management
- `/employee/customers` - Customer support
- `/employee/inventory` - View inventory status

### Admin Dashboard (Admin Role)
- `/admin/dashboard` - Admin dashboard with analytics
- `/admin/products` - Product management
- `/admin/products/create` - Add new product
- `/admin/products/[id]/edit` - Edit product
- `/admin/categories` - Category management
- `/admin/brands` - Brand management
- `/admin/orders` - Order management
- `/admin/users` - User management
- `/admin/employees` - Employee management
- `/admin/inventory` - Inventory management
- `/admin/analytics` - Analytics and reports
- `/admin/settings` - System settings
- `/admin/content` - Content management

## Environment Variables

- `NEXT_PUBLIC_BACKEND_URL` - Backend API URL
- `NEXTAUTH_SECRET` - NextAuth secret key
- `NEXTAUTH_URL` - NextAuth base URL

## Building for Production

1. Build the application:
   ```bash
   npm run build
   ```

2. Start the production server:
   ```bash
   npm run start
   ```

## Deployment

This app can be deployed to Vercel, Netlify, or any platform supporting Next.js.

For Vercel deployment:
1. Connect your GitHub repository
2. Set environment variables in Vercel dashboard
3. Deploy

## Contributing

1. Follow the existing code style
2. Use TypeScript for all new code
3. Add proper error handling
4. Test your changes

## License

MIT License
