# API Rate Limiting Implementation

## Overview

Rate limiting has been successfully implemented to protect your API from abuse, DDoS attacks, and excessive usage.

## Rate Limiters Configured

### 1. Global Limiter (All Endpoints)

- **Window**: 15 minutes
- **Max Requests**: 100 per IP
- **Applied to**: All API routes
- **Purpose**: General protection against excessive requests

### 2. Auth Limiter (Authentication Endpoints)

- **Window**: 15 minutes
- **Max Requests**: 5 per IP
- **Applied to**:
  - `/api/v1/auth/register`
  - `/api/v1/auth/login`
  - `/api/v1/auth/oauth`
  - `/api/v1/auth/forgot-password`
  - `/api/v1/auth/reset-password`
- **Purpose**: Prevent brute force attacks
- **Note**: Successful logins don't count toward limit

### 3. Payment Limiter (Payment Operations)

- **Window**: 1 hour
- **Max Requests**: 10 per IP
- **Applied to**:
  - `/api/v1/payment/bkash/create`
  - `/api/v1/payment/bkash/create/guest`
  - `/api/v1/payment/bkash/execute`
- **Purpose**: Prevent payment fraud and abuse

### 4. Upload Limiter (File Uploads)

- **Window**: 15 minutes
- **Max Requests**: 20 per IP
- **Applied to**:
  - Product creation with images
  - Product updates with images
  - Additional product image uploads
  - Feature subsection image uploads
- **Purpose**: Prevent storage abuse

### 5. Public Limiter (Reserved for Future Use)

- **Window**: 15 minutes
- **Max Requests**: 200 per IP
- **Purpose**: Can be applied to public-facing endpoints

### 6. Admin Limiter (Reserved for Future Use)

- **Window**: 15 minutes
- **Max Requests**: 300 per IP
- **Purpose**: Higher limits for authenticated admins

## Response Headers

When rate limit is hit, responses include:

- `RateLimit-Limit`: Maximum requests allowed
- `RateLimit-Remaining`: Requests remaining in current window
- `RateLimit-Reset`: Time when limit resets (Unix timestamp)

## Error Response Format

```json
{
  "success": false,
  "message": "Too many requests from this IP, please try again later."
}
```

## Files Modified

1. **`backend/src/app/middlewares/rateLimiter.ts`** (NEW)

   - Contains all rate limiter configurations

2. **`backend/src/app.ts`**

   - Added global rate limiter import
   - Applied global limiter to all requests

3. **`backend/src/app/modules/auth/auth.route.ts`**

   - Added auth limiter to authentication endpoints

4. **`backend/src/app/modules/payment/payment.route.ts`**

   - Added payment limiter to payment endpoints

5. **`backend/src/app/modules/product/product.route.ts`**
   - Added upload limiter to file upload endpoints

## Testing Rate Limits

### Test Auth Limiter (5 requests/15 min)

```bash
# Make 6 login attempts rapidly
for i in {1..6}; do
  curl -X POST http://localhost:5000/api/v1/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"test@test.com","password":"wrong"}'
done
# 6th request should return 429 Too Many Requests
```

### Test Global Limiter (100 requests/15 min)

```bash
# Make 101 requests rapidly
for i in {1..101}; do
  curl http://localhost:5000/api/v1/products
done
# 101st request should return 429
```

### Check Rate Limit Headers

```bash
curl -I http://localhost:5000/api/v1/products
# Look for RateLimit-* headers
```

## Customization

To adjust limits, edit `backend/src/app/middlewares/rateLimiter.ts`:

```typescript
export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // Change time window
  max: 100, // Change max requests
  // ... other options
});
```

## Production Recommendations

1. **Use Redis Store** (for distributed systems):
   ```bash
   npm install rate-limit-redis redis
   ```
2. **Whitelist Internal IPs**: Skip rate limiting for internal services

3. **Monitor Rate Limit Hits**: Log when users hit limits

4. **Adjust Based on Usage**: Monitor analytics and adjust limits accordingly

## Environment-Based Configuration (Future Enhancement)

Consider making limits configurable via environment variables:

```typescript
max: process.env.RATE_LIMIT_MAX || 100;
```

This allows different limits for development vs production.
