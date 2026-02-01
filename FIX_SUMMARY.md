# 🚨 502 Bad Gateway Error - Complete Fix Guide

## Problem Summary

**Error**: `POST https://evo-techbd.com/api/v1/admin/products 502 (Bad Gateway)`  
**Location**: Admin product creation page  
**Cause**: Backend server issue (crashed or not responding)

---

## ✅ Fixes Applied

### 1. Added Request Size Limits
**File**: `backend/src/app.ts`

Changed express parsers to handle large payloads (product images):
```typescript
// Before (WRONG - no limits):
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// After (FIXED - with limits):
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
```

This prevents the server from crashing when uploading large product images.

---

## 🔧 Immediate Actions (On Hostinger Server)

### Quick Fix - Just Restart

**If you just need to get it working now:**

1. SSH to your Hostinger server:
```bash
ssh your-user@your-hostinger-domain.com
```

2. Run the emergency fix script:
```bash
cd ~/public_html
bash emergency-fix-hostinger.sh
```

Or manually:
```bash
pm2 restart evo-tech-backend
pm2 logs evo-tech-backend
```

3. Test product creation again

---

## 📦 Deploy the Permanent Fix

### Method 1: Using Git (Recommended)

**On your local machine:**
```bash
cd d:/Programming/Projects/evo_tech
git add backend/src/app.ts
git commit -m "Fix: Add 50MB request size limit to prevent 502 errors"
git push origin main
```

**On Hostinger server:**
```bash
ssh your-user@your-server.com
cd ~/public_html/backend
git pull origin main
npm run build
pm2 restart evo-tech-backend
pm2 logs evo-tech-backend
```

### Method 2: Manual Deployment

**On your local machine:**
```bash
cd backend
npm run build
```

Then upload the `backend/dist/` folder to Hostinger via FTP/SCP.

**On Hostinger server:**
```bash
cd ~/public_html/backend
pm2 restart evo-tech-backend
```

---

## 🔍 Diagnostic Tools Created

### 1. `emergency-fix-hostinger.sh`
**What it does**: Checks status, shows logs, and restarts backend  
**When to use**: When you need to quickly fix the 502 error  
**How to use**:
```bash
# On Hostinger server
bash emergency-fix-hostinger.sh
```

### 2. `hostinger-health-check.sh`
**What it does**: Complete health check of your backend  
**When to use**: To diagnose what's wrong  
**How to use**:
```bash
# On Hostinger server
bash hostinger-health-check.sh
```

### 3. `check-hostinger-logs.sh`
**What it does**: Detailed log analysis  
**When to use**: When you need to see what errors occurred  
**How to use**:
```bash
# On Hostinger server
bash check-hostinger-logs.sh
```

---

## 📚 Documentation Created

### 1. `502_ERROR_ANALYSIS.md`
Complete technical analysis of the error with all possible causes and fixes.

### 2. `HOSTINGER_502_DEBUG.md`
Step-by-step debugging guide specifically for Hostinger hosting.

---

## 🧪 Testing After Fix

1. **Check backend is running:**
```bash
pm2 list
# Should show: evo-tech-backend | online
```

2. **Check health endpoint:**
```bash
curl http://localhost:5000/health
# Should return: {"success":true,"message":"Server is healthy"...}
```

3. **Test product creation:**
- Go to: https://evo-techbd.com/control/products/create
- Try adding a product with 1 small image
- If successful, try with multiple images

4. **Monitor logs during test:**
```bash
pm2 logs evo-tech-backend
```

---

## 🐛 Common Issues & Solutions

### Issue 1: Backend keeps crashing
**Solution**: Increase memory limit in `backend/ecosystem.config.js`:
```javascript
max_memory_restart: "2G"  // Change from 1G
```

### Issue 2: Still getting 502 after restart
**Check**: 
1. Database connection (MongoDB Atlas IP whitelist)
2. Environment variables (`.env` file)
3. Nginx/Apache configuration

### Issue 3: Images too large
**Solution**: 
- Compress images before upload (max 2MB each)
- Or increase limit in `app.ts` to `100mb` if needed

### Issue 4: Timeout errors
**Solution**: Add timeout middleware (see `502_ERROR_ANALYSIS.md`)

---

## 📊 Monitoring Commands

### Real-time Monitoring
```bash
# Live logs
pm2 logs evo-tech-backend

# CPU/Memory monitor
pm2 monit

# Detailed process info
pm2 describe evo-tech-backend
```

### Quick Checks
```bash
# Status check
pm2 list

# Memory check
free -h

# Disk space
df -h

# Recent errors
pm2 logs evo-tech-backend --err --lines 50 --nostream
```

---

## 🆘 Emergency Contacts

If the problem persists after all fixes:

1. **Share these logs** with your team:
```bash
pm2 logs evo-tech-backend --err --lines 100 --nostream > error_log.txt
pm2 describe evo-tech-backend > process_info.txt
```

2. **Check Hostinger server logs** (may need support):
   - Nginx error logs
   - Apache error logs
   - System logs

3. **Contact Hostinger support** if:
   - Server keeps running out of memory
   - Nginx/Apache timeouts need adjustment
   - IP whitelisting issues with MongoDB

---

## ✅ Checklist

Before closing this issue, ensure:

- [ ] Backend fix committed and deployed
- [ ] Backend restarted on Hostinger
- [ ] Health check passes (`curl http://localhost:5000/health`)
- [ ] Product creation tested successfully
- [ ] Logs show no errors
- [ ] Memory usage is stable

---

## 📝 What Changed

**Files Modified:**
1. `backend/src/app.ts` - Added 50MB request size limits

**Files Created:**
1. `emergency-fix-hostinger.sh` - Emergency restart script
2. `hostinger-health-check.sh` - Health check script
3. `check-hostinger-logs.sh` - Log analysis script
4. `502_ERROR_ANALYSIS.md` - Technical analysis document
5. `HOSTINGER_502_DEBUG.md` - Debugging guide
6. `deploy-backend-fix.sh` - Deployment helper script

---

## 🎯 Summary

**Root Cause**: Backend server crashed or became unresponsive, likely due to large product image uploads without proper size limits.

**Primary Fix**: Added `{ limit: '50mb' }` to express body parsers.

**Immediate Action**: Restart backend on Hostinger using `pm2 restart evo-tech-backend`.

**Long-term Solution**: Deploy the code fix and monitor server performance.

---

**Last Updated**: February 1, 2026  
**Status**: Fix ready for deployment  
**Priority**: HIGH - Affects admin product management
