# bKash Payment Gateway Integration Guide

## Overview

This document provides comprehensive information about the bKash payment gateway integration in the evo-tech e-commerce platform.

## Prerequisites

### 1. Get bKash Merchant Credentials

To use bKash payment gateway, you need to:

1. Register as a bKash merchant at [https://www.bkash.com/](https://www.bkash.com/)
2. Contact bKash support to get your sandbox/production credentials:
   - App Key
   - App Secret
   - Username
   - Password

### 2. Environment Configuration

Add the following variables to your `.env` file:

```env
# bKash Payment Gateway
BKASH_BASE_URL=https://tokenized.sandbox.bka.sh/v1.2.0-beta  # Sandbox URL
BKASH_APP_KEY=your-app-key-here
BKASH_APP_SECRET=your-app-secret-here
BKASH_USERNAME=your-username-here
BKASH_PASSWORD=your-password-here
FRONTEND_URL=http://localhost:3000
```

**Note:** For production, change `BKASH_BASE_URL` to:

```
BKASH_BASE_URL=https://tokenized.pay.bka.sh/v1.2.0-beta
```

## API Endpoints

### 1. Create Payment

**Endpoint:** `POST /api/v1/payment/bkash/create`

**Authentication:** Required

**Request Body:**

```json
{
  "amount": 1000,
  "orderId": "507f1f77bcf86cd799439011"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Payment created successfully",
  "data": {
    "paymentID": "TR0011xxx",
    "bkashURL": "https://tokenized.sandbox.bka.sh/...",
    "amount": "1000",
    "transactionStatus": "Initiated"
  }
}
```

**Usage:**

1. User clicks "Pay with bKash" button
2. Frontend calls this endpoint with order amount and ID
3. Backend creates payment and returns bKash URL
4. Frontend redirects user to bKash URL for payment authorization

### 2. Execute Payment

**Endpoint:** `POST /api/v1/payment/bkash/execute`

**Authentication:** Required

**Request Body:**

```json
{
  "paymentID": "TR0011xxx",
  "orderId": "507f1f77bcf86cd799439011"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Payment executed successfully",
  "data": {
    "paymentID": "TR0011xxx",
    "trxID": "8HJ59S46K2",
    "transactionStatus": "Completed",
    "amount": "1000"
  }
}
```

**Usage:**

1. After user authorizes payment on bKash, they are redirected back
2. Frontend calls this endpoint with paymentID from URL params
3. Backend executes payment and updates order status

### 3. Query Payment Status

**Endpoint:** `GET /api/v1/payment/bkash/query/:paymentID`

**Authentication:** Required

**Response:**

```json
{
  "success": true,
  "message": "Payment status retrieved successfully",
  "data": {
    "paymentID": "TR0011xxx",
    "trxID": "8HJ59S46K2",
    "transactionStatus": "Completed",
    "amount": "1000",
    "merchantInvoiceNumber": "ORD-2024-001"
  }
}
```

**Usage:**
Used to check payment status at any time.

### 4. Callback Handler

**Endpoint:** `GET /api/v1/payment/bkash/callback`

**Authentication:** Not required (called by bKash)

**Query Parameters:**

- `paymentID` - bKash payment ID
- `status` - success | failure | cancel

**Behavior:**

- Automatically updates order status
- Redirects user to appropriate page:
  - Success: `/order/{orderNumber}?status=success`
  - Failure: `/checkout?status=failure`
  - Cancel: `/checkout?status=cancel`

### 5. Webhook Handler

**Endpoint:** `POST /api/v1/payment/bkash/webhook`

**Authentication:** Not required (called by bKash)

**Usage:**
Receives notifications from bKash about payment status changes.

## Payment Flow

### For Authenticated Users

```
1. User adds items to cart
   ↓
2. User proceeds to checkout
   ↓
3. User fills in shipping details
   ↓
4. User selects "bKash" as payment method
   ↓
5. Frontend calls POST /api/v1/payment/bkash/create
   ↓
6. Backend creates payment and returns bKash URL
   ↓
7. User is redirected to bKash payment page
   ↓
8. User enters bKash PIN and authorizes payment
   ↓
9. bKash redirects to callback URL with paymentID
   ↓
10. Callback handler queries payment status
    ↓
11. Order is updated with transaction ID
    ↓
12. User sees order confirmation
```

### For Guest Users

```
1. Guest user adds items to cart
   ↓
2. Guest proceeds to checkout (no login required)
   ↓
3. Guest fills in shipping details + email
   ↓
4. Guest selects "bKash" as payment method
   ↓
5. Order is created as guest order with isGuest=true
   ↓
6. Frontend calls POST /api/v1/payment/bkash/create
   ↓
7. Payment flow continues as normal
   ↓
8. Order is linked to user if they register with same email
```

## Order Schema Updates

The Order model includes the following bKash-related fields:

```typescript
{
  bkashPaymentID?: string;      // Payment ID from bKash create
  bkashTransactionId?: string;  // Transaction ID after successful payment
  paymentStatus: "pending" | "paid" | "failed" | "refunded";
  paymentMethod: string;        // "bkash" when using bKash
}
```

## Frontend Integration

### Example: Create Payment Button

```typescript
const handleBkashPayment = async (orderId: string, amount: number) => {
  try {
    const response = await axios.post("/api/payment/bkash/create", {
      orderId,
      amount,
    });

    if (response.data.success) {
      // Redirect to bKash payment page
      window.location.href = response.data.data.bkashURL;
    }
  } catch (error) {
    console.error("Payment creation failed:", error);
    toast.error("Failed to initiate payment");
  }
};
```

### Example: Handle Callback

```typescript
// In your callback page component
useEffect(() => {
  const urlParams = new URLSearchParams(window.location.search);
  const paymentID = urlParams.get("paymentID");
  const status = urlParams.get("status");
  const orderId = urlParams.get("orderId");

  if (status === "success" && paymentID && orderId) {
    executePayment(paymentID, orderId);
  }
}, []);

const executePayment = async (paymentID: string, orderId: string) => {
  try {
    const response = await axios.post("/api/payment/bkash/execute", {
      paymentID,
      orderId,
    });

    if (response.data.success) {
      toast.success("Payment successful!");
      router.push(`/order/${orderId}`);
    }
  } catch (error) {
    toast.error("Payment execution failed");
  }
};
```

## Testing with Sandbox

### Test Credentials

bKash provides sandbox credentials for testing. Contact bKash support for:

- Sandbox App Key
- Sandbox App Secret
- Test merchant credentials

### Test Flow

1. Use sandbox URL: `https://tokenized.sandbox.bka.sh/v1.2.0-beta`
2. Use test bKash account numbers provided by bKash
3. No real money is charged in sandbox mode

## Error Handling

### Common Errors

**1. Authentication Failed (401)**

- Check if credentials are correct
- Verify token hasn't expired
- Ensure proper headers are set

**2. Payment Creation Failed (400)**

- Verify amount is valid (greater than 0)
- Check merchantInvoiceNumber is unique
- Ensure all required fields are provided

**3. Payment Execution Failed**

- User may have cancelled payment
- Payment may have timed out
- Insufficient bKash balance

### Error Response Example

```json
{
  "success": false,
  "message": "Failed to create bKash payment",
  "statusCode": 500
}
```

## Security Considerations

1. **Never expose credentials in frontend**

   - All bKash API calls are made from backend
   - Credentials stored in environment variables

2. **Validate payment before fulfilling order**

   - Always verify payment status using queryPayment
   - Check transaction status is "Completed"
   - Verify amount matches order total

3. **Implement webhook verification**

   - Verify webhook requests come from bKash IPs
   - Validate payload signatures if available

4. **Rate limiting**
   - Implement rate limiting on payment endpoints
   - Prevent abuse and duplicate payment attempts

## Production Deployment Checklist

- [ ] Update `BKASH_BASE_URL` to production URL
- [ ] Use production bKash credentials
- [ ] Set up proper error logging
- [ ] Configure webhook endpoint in bKash merchant portal
- [ ] Test full payment flow
- [ ] Set up monitoring for failed payments
- [ ] Implement refund handling
- [ ] Configure proper CORS settings
- [ ] Enable HTTPS for all endpoints
- [ ] Set up backup payment method

## Support

For bKash integration support:

- bKash Merchant Support: [merchant.bkash.com](https://merchant.bkash.com)
- Technical Documentation: Contact bKash support for API docs
- Email: merchant@bkash.com

## Notes

- Token caching is implemented to reduce API calls
- Tokens expire after the time specified by bKash (usually 1 hour)
- All amounts should be in BDT (Bangladeshi Taka)
- Minimum transaction amount may apply (check with bKash)
- Maximum transaction limit per day varies by merchant type
