# 502 Bad Gateway Error - Analysis & Solutions

## Error Details
- **Endpoint**: `POST https://evo-techbd.com/api/v1/admin/products`
- **Error Code**: 502 Bad Gateway
- **Location**: Product creation page (`/control/products/create`)

## Root Cause Analysis

A 502 Bad Gateway error means the Next.js frontend received an invalid response from the backend server. This typically happens when:

1. ✅ **Backend server is down or crashed** (Most likely)
2. ✅ **Request timeout** - Product creation with images takes too long
3. ✅ **Memory limit exceeded** - Image processing uses too much RAM
4. ✅ **Missing request size limits** - Large file uploads crash the server
5. ⚠️ **Database connection lost**
6. ⚠️ **Nginx/Apache timeout**

---

## Immediate Actions Required on Hostinger

### 1. Check if Backend is Running
```bash
ssh your-user@your-hostinger-server.com
cd ~/public_html  # or your deployment path
pm2 list
```

**Expected**: `evo-tech-backend` should show status "online"
**If not online**: Server has crashed - check Step 2

### 2. View Server Logs
```bash
# View error logs
pm2 logs evo-tech-backend --err --lines 100 --nostream

# Or check log files directly
tail -100 backend/logs/pm2-error.log
```

**Look for these error patterns:**
- `Error: Request Entity Too Large` → File too large
- `JavaScript heap out of memory` → Memory issue
- `ECONNREFUSED` or `MongoDB` → Database problem
- `timeout` → Request taking too long
- `502` or `Bad Gateway` → Server crashed

### 3. Restart the Backend
```bash
pm2 restart evo-tech-backend
pm2 logs evo-tech-backend
```

Then test product creation again.

---

## Code Issues Found & Fixes Needed

### Issue 1: No Request Size Limits ⚠️ CRITICAL

**Location**: `backend/src/app.ts` (lines 67-68)

**Current Code**:
```typescript
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
```

**Problem**: No size limits means large requests can crash the server

**Fix**: Add size limits
```typescript
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
```

### Issue 2: Memory Limit May Be Too Low

**Location**: `backend/ecosystem.config.js`

**Current**: `max_memory_restart: "1G"`

**Issue**: Image processing (especially with Cloudinary) can exceed 1GB

**Recommendation**: 
- If Hostinger plan allows, increase to `"2G"`
- Monitor actual usage with `pm2 monit`

### Issue 3: No Request Timeout Handling

The backend doesn't have explicit timeout handling for long-running operations like image uploads.

---

## Step-by-Step Fix Guide

### Step 1: Update Backend Configuration

**File**: `backend/src/app.ts`

Add size limits to line 67-68:
```typescript
// Parser with size limits
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
```

### Step 2: Update PM2 Configuration (Optional)

**File**: `backend/ecosystem.config.js`

If your Hostinger plan supports it:
```javascript
max_memory_restart: "2G",  // Increase from 1G
```

### Step 3: Deploy to Hostinger

```bash
# On your local machine
cd backend
npm run build

# Upload to Hostinger (or use Git deployment)
# Then on Hostinger:
pm2 restart evo-tech-backend
pm2 logs evo-tech-backend
```

### Step 4: Add Request Timeout (Advanced)

**File**: `backend/src/app.ts`

Add after line 11:
```typescript
import timeout from 'connect-timeout';

// Add after creating app
app.use(timeout('120s')); // 2 minute timeout for image uploads
app.use((req, res, next) => {
  if (!req.timedout) next();
});
```

**Install package**:
```bash
npm install connect-timeout
npm install -D @types/connect-timeout
```

---

## Temporary Workaround

While waiting for fixes to deploy:

1. **Reduce image sizes** before uploading
2. **Upload smaller products** (fewer images/features)
3. **Check if backend restarted** after each failed attempt
4. **Use image compression** (max 2MB per image)

---

## Monitoring Commands

### Real-time Monitoring
```bash
# Watch logs in real-time
pm2 logs evo-tech-backend

# Monitor memory/CPU
pm2 monit

# Detailed info
pm2 describe evo-tech-backend
```

### Check Health
```bash
# Test backend directly
curl http://localhost:5000/health

# Check memory
free -h

# Check disk space
df -h
```

---

## Expected Log Patterns

### ✅ Normal Product Creation
```
POST /api/v1/products 201 - 1234ms
Product created successfully
```

### ❌ Memory Error
```
JavaScript heap out of memory
pm2: App [evo-tech-backend] will restart in 4000ms
```

### ❌ Timeout Error
```
Error: Request timeout
POST /api/v1/products - - ms
```

### ❌ Size Limit Error
```
PayloadTooLargeError: request entity too large
```

---

## Testing After Fix

1. **Restart backend** on Hostinger
2. **Test with small product** (no images)
3. **Test with 1 small image** (< 1MB)
4. **Test with multiple images**
5. **Monitor logs** during each test

---

## If Problem Persists

### Check Nginx/Apache Configuration

Hostinger uses Nginx or Apache as reverse proxy. They may have their own timeout/size limits:

**Nginx**: Usually in `/etc/nginx/nginx.conf`
```nginx
client_max_body_size 50M;
proxy_read_timeout 120s;
```

**Apache**: Usually in `.htaccess` or `httpd.conf`
```apache
LimitRequestBody 52428800  # 50MB
Timeout 120
```

**Note**: You might need to contact Hostinger support to adjust these.

---

## Quick Diagnostic Checklist

Run these on Hostinger and share results:

```bash
# 1. Process status
pm2 list

# 2. Last 50 error lines
pm2 logs evo-tech-backend --err --lines 50 --nostream

# 3. Memory usage
pm2 describe evo-tech-backend | grep -i memory

# 4. System resources
free -h && df -h

# 5. Test backend
curl -I http://localhost:5000/health
```

---

## Summary

**Most Likely Cause**: Backend crashed due to large file upload without size limits

**Primary Fix**: Add `{ limit: '50mb' }` to express.json() and express.urlencoded()

**Secondary Fix**: Increase PM2 memory limit if needed

**Immediate Action**: SSH to Hostinger, check `pm2 logs`, and restart backend

---

## Need More Help?

If the issue persists after applying fixes, please provide:
1. Output of `pm2 logs evo-tech-backend --err --lines 100`
2. Output of `pm2 describe evo-tech-backend`
3. Your Hostinger hosting plan details (RAM/CPU limits)
