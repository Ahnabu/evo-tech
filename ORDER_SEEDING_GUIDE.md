# Order Seeding & Data Structure Fix Guide

## Issues Fixed

### 1. **Schema Mismatch (Root Cause)**
- **Problem**: Frontend schema used `snake_case` (e.g., `order_status`, `payment_method`) while backend uses `camelCase` (e.g., `orderStatus`, `paymentMethod`)
- **Solution**: Updated `frontend/schemas/admin/sales/orderSchema.ts` to match backend naming convention

### 2. **Column Field Names**
- **Fixed Fields in `order-columns.tsx`**:
  - `orderid` → `orderNumber`
  - `total_payable` → `totalPayable`
  - `order_status` → `orderStatus`
  - `payment_status` → `paymentStatus`
  - `payment_method` → `paymentMethod`
  - `shipping_type` → `shippingType`
  - `firstName/lastName` → `firstname/lastname` (with fallbacks)

### 3. **Null Safety**
- Added optional chaining (`?.`) to all `.replace()` and `.replaceAll()` calls
- Added fallback values (`|| 'N/A'`) to prevent undefined errors

## Backend Data Structure (From MongoDB)

```typescript
interface TOrder {
  _id?: string;
  orderNumber: string;           // "ORD-1234567890-ABCD1234"
  user: string;                  // User UUID
  firstname: string;             // Customer first name
  lastname: string;              // Customer last name
  phone: string;                 // "01712345678"
  email: string;                 // "customer@example.com"
  houseStreet: string;           // "123, Street 45"
  city: string;                  // "Dhaka"
  subdistrict?: string;          // "Dhaka District"
  postcode: string;              // "1200"
  country: string;               // "Bangladesh"
  shippingType: string;          // "home_delivery" | "pickup_point" | "express_delivery"
  pickupPointId?: string;        // Optional pickup point ID
  paymentMethod: string;         // "cash_on_delivery" | "bkash" | "nagad" | "credit_card" | "bank_transfer"
  transactionId?: string;        // "TXN-1234567890-1"
  terms: boolean;                // true
  subtotal: number;              // 15000
  discount: number;              // 500
  deliveryCharge: number;        // 100
  additionalCharge: number;      // 0
  totalPayable: number;          // 14600
  orderStatus: string;           // "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled"
  paymentStatus: string;         // "pending" | "paid" | "failed" | "refunded"
  notes?: string;                // Optional order notes
  trackingCode?: string;         // "TRACK-1234567890-1"
  viewed: boolean;               // false
  unpaidNotified: boolean;       // false
  deliveredAt?: Date;            // Optional delivery timestamp
  createdAt?: Date;              // Auto-generated
  updatedAt?: Date;              // Auto-generated
}
```

## Seeding Test Orders

### Method 1: Using NPM Script (Recommended)

```bash
# Navigate to backend
cd backend

# Seed 20 new test orders (keeps existing data)
npm run seed:orders

# Clear existing orders and seed 20 new ones
npm run seed:orders:clear
```

### Method 2: Manual Execution

```bash
cd backend
npx ts-node-dev --transpile-only src/seedOrders.ts
```

### Method 3: Auto-seed on Server Start (Optional)

Uncomment the line in `backend/src/server.ts`:
```typescript
// await seedTestOrders();  // ← Remove the //
```

## Seeding Script Details

**Location**: `backend/src/app/utils/seedOrders.ts`

**What it creates**:
- 20 random orders with realistic data
- Random customer names from predefined lists
- Random cities (8 major BD cities)
- 1-3 products per order
- Random order statuses (pending, confirmed, processing, shipped, delivered, cancelled)
- Random payment statuses (matching order status logic)
- Random payment methods (COD, bKash, Nagad, Credit Card, Bank Transfer)
- Random shipping types (Home Delivery, Pickup Point, Express)
- Order items linked to actual products from database

**Prerequisites**:
- At least 1 user in database
- At least 1 published product in database

## Console Logging (For Debugging)

Enhanced logging in `use-orders-data.ts` shows:
```typescript
📊 useOrdersData - Extracted: {
  ordersCount: 10,
  pagination: {...},
  sampleOrder: {...},
  sampleOrderKeys: ["_id", "orderNumber", "user", ...],
  allOrderFields: {
    orderNumber: "ORD-...",
    orderStatus: "pending",
    paymentStatus: "pending",
    paymentMethod: "cash_on_delivery",
    shippingType: "home_delivery",
    totalPayable: 15000,
    firstname: "Ahmed",
    lastname: "Khan",
    email: "ahmed.khan@example.com"
  }
}
```

## Testing Checklist

1. ✅ Clear existing orders: `npm run seed:orders:clear`
2. ✅ Check console logs for order data structure
3. ✅ Verify table displays 10 orders per page
4. ✅ Test pagination (should have 2 pages total)
5. ✅ Check all columns render correctly:
   - Order Number
   - Customer Name (firstname lastname)
   - Email
   - Amount (totalPayable formatted as BDT)
   - Order Status (with colored badges)
   - Payment Status (with colored badges)
   - Payment Method
   - Shipping Type
   - Actions
6. ✅ Test status filters (pending, confirmed, etc.)
7. ✅ Test search functionality
8. ✅ Verify no "Cannot read properties of undefined" errors

## Next Steps

After successful seeding:
1. Navigate to `/control/orders` in your admin panel
2. Verify all 20 orders are visible (10 per page)
3. Test status update functionality
4. Test order detail view
5. Check dashboard recent orders widget

## Notes

- Seeding script is idempotent - you can run it multiple times
- Use `--clear` flag only when you want to remove ALL existing orders
- Order numbers are unique and auto-generated
- Customer emails follow pattern: `{firstname}.{lastname}@example.com`
- All monetary values are in BDT (Bangladeshi Taka)
