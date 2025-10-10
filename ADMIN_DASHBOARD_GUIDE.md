# Admin Dashboard Guide

This guide explains how the admin dashboard is currently implemented and how to add or modify features in the future.

## Current Admin Dashboard Structure

The admin dashboard is located in `frontend/app/(admins)/` and includes:

### Pages
- `dashboard/` - Main dashboard overview
- `products/` - Product management
- `categories/` - Category management
- `subcategories/` - Subcategory management
- `brands/` - Brand management
- `orders/` - Order management
- `setup-config/` - System configuration

### Layout
- `layout.tsx` - Admin layout with navigation
- Shared components in `components/admin/`

## Backend Admin API

Admin routes are prefixed with `/api/admin` and include:

### Products Management
- `GET /api/admin/items/allitems` - Get all products
- `POST /api/admin/items/create` - Create new product
- `POST /api/admin/items/update/{itemId}` - Update product
- `DELETE /api/admin/items/delete/{itemId}` - Delete product

### Categories Management
- `GET /api/admin/category/all` - Get all categories
- `POST /api/admin/category/create` - Create category
- `PUT /api/admin/category/update/{categoryId}` - Update category
- `DELETE /api/admin/category/delete/{categoryId}` - Delete category

### Orders Management
- `GET /api/admin/order/allorders` - Get all orders
- `GET /api/admin/order/view/{orderId}` - Get order details
- `PUT /api/admin/order/update-statuses/{orderId}` - Update order status

## How to Add New Admin Features

### 1. Backend Changes

#### Add New Routes
1. Create controller in `app/Http/Controllers/Admin/`
2. Add routes to `routes/api.php` under the admin group
3. Implement CRUD operations

Example:
```php
// In routes/api.php
Route::get('/new-feature/all', [NewFeatureController::class, 'getAll'])->name('newfeature.all');
Route::post('/new-feature/create', [NewFeatureController::class, 'create'])->name('newfeature.create');
```

#### Create Model and Migration
```bash
php artisan make:model NewFeature -m
php artisan migrate
```

### 2. Frontend Changes

#### Add New Page
1. Create new folder in `app/(admins)/control/`
2. Add `page.tsx` with your component
3. Update navigation in admin layout

#### Create Components
- Add components in `components/admin/`
- Use existing UI components from `components/ui/`
- Follow the pattern of existing admin pages

#### State Management
- Add slices in `store/slices/` if needed
- Use Redux Toolkit for complex state

### 3. Navigation Updates

Update `app/(admins)/layout.tsx` to include new navigation items:

```tsx
const navItems = [
  // ... existing items
  {
    title: "New Feature",
    href: "/admins/control/new-feature",
    icon: IconComponent,
  },
];
```

## Best Practices

### Backend
- Use resource controllers for CRUD operations
- Validate input with Form Requests
- Use API Resources for consistent responses
- Add proper authorization/policies

### Frontend
- Use TypeScript for type safety
- Follow existing component patterns
- Use React Hook Form for forms
- Implement proper error handling
- Use SWR for data fetching

### Security
- Ensure admin routes are properly protected
- Validate all inputs
- Use CSRF protection
- Log admin actions

## Existing Admin Features

The current admin dashboard includes:

1. **Dashboard** - Overview with statistics
2. **Products** - Full CRUD for products with features/specs
3. **Categories** - Manage product categories
4. **Subcategories** - Manage subcategories
5. **Brands** - Manage product brands
6. **Orders** - View and manage customer orders
7. **Landing Page** - Manage carousel, sections, trusted clients

## Future Enhancements

Potential features to add:
- User management
- Analytics and reporting
- Content management system
- Email marketing tools
- Inventory management
- Customer support tickets
- Settings and configuration

## Troubleshooting

- Ensure backend is running and accessible
- Check API endpoints match frontend calls
- Verify authentication tokens
- Check browser console for errors
- Use network tab to debug API calls