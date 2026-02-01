# Hostinger 502 Bad Gateway Debugging Guide

## Issue: POST /api/v1/admin/products returns 502 Bad Gateway

### Possible Causes:
1. Backend server crashed or not running
2. Memory/resource limits exceeded
3. Database connection issues
4. Request timeout during image upload
5. Missing environment variables

---

## Steps to Debug on Hostinger:

### Step 1: SSH into your Hostinger server
```bash
ssh your-username@your-hostinger-server.com
```

### Step 2: Check if PM2 process is running
```bash
cd ~/public_html  # or your deployment directory
pm2 list
```

**Expected output:** Backend process should show "online" status
**If offline:** The server has crashed - check logs in Step 3

### Step 3: Check PM2 logs for errors
```bash
# View last 100 lines of error logs
pm2 logs evo-tech-backend --err --lines 100 --nostream

# Or check specific log files
tail -n 100 ~/public_html/backend/logs/pm2-error.log
```

**Common errors to look for:**
- ❌ `ECONNREFUSED` - Database connection failed
- ❌ `ENOMEM` - Out of memory
- ❌ `MongoDB connection error` - Database credentials issue
- ❌ `PayloadTooLargeError` - File upload size exceeds limit
- ❌ `Timeout` - Request taking too long

### Step 4: Check memory usage
```bash
# Check current memory
free -h

# Check PM2 memory usage
pm2 describe evo-tech-backend | grep -i memory
```

**If memory is near limit:**
Your max_memory_restart is set to 1GB - the server might be restarting frequently

### Step 5: Check database connection
```bash
# From your backend directory
cd ~/public_html/backend

# Check .env file exists and has correct values
cat .env | grep -E "DB_URL|MONGODB"
```

### Step 6: Test backend endpoint directly
```bash
# Check if backend is responding
curl -I http://localhost:5000

# Test products endpoint
curl http://localhost:5000/api/v1/products
```

### Step 7: Check Nginx/Apache configuration
```bash
# Check if proxy is configured correctly
# For Nginx:
sudo nginx -t

# For Apache:
sudo apachectl configtest
```

---

## Quick Fixes:

### Fix 1: Restart the backend
```bash
pm2 restart evo-tech-backend
pm2 logs evo-tech-backend --lines 50
```

### Fix 2: Increase memory limit (if memory issue)
Edit `backend/ecosystem.config.js`:
```javascript
max_memory_restart: "2G"  // Change from 1G to 2G
```
Then:
```bash
pm2 restart evo-tech-backend
```

### Fix 3: Increase file upload size limit
Edit `backend/src/app.ts` and check body-parser limits:
```typescript
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
```

### Fix 4: Fix database connection
If database connection is the issue:
```bash
# Check if MongoDB is running
systemctl status mongod

# Or test remote MongoDB connection
mongo "your-mongodb-connection-string"
```

### Fix 5: Check environment variables
```bash
cd ~/public_html/backend
cat .env

# Make sure these exist:
# - DB_URL or MONGODB_URI
# - NODE_ENV=production
# - PORT=5000
# - JWT_SECRET
# - CLOUDINARY_* (for image uploads)
```

---

## Check Specific Logs on Hostinger:

```bash
# Navigate to backend directory
cd ~/public_html/backend

# Check PM2 logs
cat logs/pm2-error.log | tail -100
cat logs/pm2-out.log | tail -100

# Check for specific error patterns
grep -i "error\|failed\|exception" logs/pm2-error.log | tail -50
```

---

## Emergency Recovery:

If server keeps crashing:

1. **Stop the process:**
```bash
pm2 stop evo-tech-backend
```

2. **Clear logs:**
```bash
pm2 flush
rm -f logs/pm2-*.log
```

3. **Rebuild and restart:**
```bash
npm run build
pm2 restart evo-tech-backend
```

4. **Monitor in real-time:**
```bash
pm2 logs evo-tech-backend
```

---

## Most Common Solutions:

### Solution 1: Server crashed - just restart
```bash
pm2 restart evo-tech-backend
```

### Solution 2: Database connection issue
- Check MongoDB Atlas IP whitelist (add 0.0.0.0/0 or your Hostinger IP)
- Verify connection string in .env

### Solution 3: Memory exceeded
- Increase max_memory_restart in ecosystem.config.js
- Optimize your product creation code
- Check for memory leaks

### Solution 4: Request timeout
- Increase Nginx/Apache timeout settings
- Optimize image upload process
- Use background jobs for heavy operations

---

## Get Help Information:

Run this command to get diagnostic info:
```bash
cd ~/public_html/backend
pm2 info evo-tech-backend
pm2 logs evo-tech-backend --err --lines 50 --nostream
free -h
df -h
```

Share the output with your team for further debugging.
