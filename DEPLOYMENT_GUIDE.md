# 🚀 Evo-Tech Production Deployment Guide

## Overview

This guide covers deploying Evo-Tech to Hostinger with:
- **Main Domain**: `evo-techbd.com` (Frontend - Next.js)
- **API Subdomain**: `api.evo-techbd.com` (Backend - Express/Node.js)

## Prerequisites

1. ✅ Hostinger shared hosting account
2. ✅ SSH access configured
3. ✅ Subdomain `api.evo-techbd.com` pointing to server
4. ✅ PM2 installed on server
5. ✅ Node.js v18+ installed on server

## Step 1: Prepare Deployment Package

Run the deployment preparation script:

```bash
bash prepare_upload.sh
```

This will:
- Build frontend with unique Build ID
- Build backend
- Install production dependencies
- Create deployment packages in `hostinger_upload/`

**Output Structure:**
```
hostinger_upload/
├── public_html/          # Frontend files → evo-techbd.com
└── api_subdomain/        # Backend files → api.evo-techbd.com
```

## Step 2: Upload Files to Hostinger

### Option A: Using SCP (Recommended)

```bash
# Upload Frontend
scp -P 65002 -r hostinger_upload/public_html/* u379849097@46.202.161.130:~/domains/evo-techbd.com/public_html/

# Upload Backend
scp -P 65002 -r hostinger_upload/api_subdomain/* u379849097@46.202.161.130:~/domains/api.evo-techbd.com/public_html/
```

### Option B: Using FileZilla/SFTP

**Server Details:**
- Host: `46.202.161.130`
- Port: `65002`
- Protocol: SFTP
- Username: `u379849097`

**Upload Locations:**
1. `hostinger_upload/public_html/*` → `/domains/evo-techbd.com/public_html/`
2. `hostinger_upload/api_subdomain/*` → `/domains/api.evo-techbd.com/public_html/`

### Option C: Using Hostinger File Manager

1. Login to Hostinger hPanel
2. Go to **File Manager**
3. Navigate to each domain folder
4. Upload respective files

## Step 3: SSH into Server

```bash
ssh -p 65002 u379849097@46.202.161.130
```

## Step 4: Configure and Start Services

### A. Start Backend (API Subdomain)

```bash
cd ~/domains/api.evo-techbd.com/public_html

# Stop existing instance if running
pm2 delete evo-tech-backend 2>/dev/null || true

# Start backend with environment variables
pm2 start ecosystem.config.js --update-env

# Check status
pm2 logs evo-tech-backend --lines 50
```

### B. Start Frontend (Main Domain)

```bash
cd ~/domains/evo-techbd.com/public_html

# Stop existing instance if running
pm2 delete evo-tech-frontend 2>/dev/null || true

# Start frontend
pm2 start ecosystem.config.js

# Check status
pm2 logs evo-tech-frontend --lines 50
```

### C. Save PM2 Configuration

```bash
# Save current PM2 processes
pm2 save

# Setup PM2 to start on system reboot
pm2 startup

# View all processes
pm2 list
```

**Expected Output:**
```
┌────┬──────────────────────┬─────────┬─────────┬─────────┬──────────┐
│ id │ name                 │ version │ mode    │ pid     │ status   │
├────┼──────────────────────┼─────────┼─────────┼─────────┼──────────┤
│ 0  │ evo-tech-backend     │ 1.0.0   │ cluster │ xxxxx   │ online   │
│ 1  │ evo-tech-frontend    │ 1.1.0   │ cluster │ xxxxx   │ online   │
└────┴──────────────────────┴─────────┴─────────┴─────────┴──────────┘
```

## Step 5: Verify Deployment

### A. Check PM2 Status

```bash
pm2 status
pm2 logs
```

### B. Test Endpoints

**Frontend:**
```bash
curl -I https://evo-techbd.com
```

**Backend Health:**
```bash
curl https://api.evo-techbd.com/api/health
# or
curl https://api.evo-techbd.com/api/v1/health
```

**API Test:**
```bash
# Test a public endpoint
curl https://api.evo-techbd.com/api/v1/products
```

### C. Browser Testing

1. **Frontend**: Open https://evo-techbd.com
2. **Test Features**:
   - Page loads correctly
   - Images display
   - Navigation works
   - Login/Register
3. **API Integration**:
   - Check browser console for errors
   - Verify API calls go to `api.evo-techbd.com`

## Step 6: Setup Keep-Alive (Auto-Restart)

Create a keep-alive script to ensure services stay running:

```bash
nano ~/pm2-keepalive.sh
```

Add the following:

```bash
#!/bin/bash

# Check and restart backend if needed
if ! pm2 list | grep -q "evo-tech-backend.*online"; then
    cd ~/domains/api.evo-techbd.com/public_html
    pm2 delete evo-tech-backend 2>/dev/null || true
    pm2 start ecosystem.config.js --update-env
    pm2 save
    echo "[$(date)] Backend restarted" >> ~/pm2-keepalive.log
fi

# Check and restart frontend if needed
if ! pm2 list | grep -q "evo-tech-frontend.*online"; then
    cd ~/domains/evo-techbd.com/public_html
    pm2 delete evo-tech-frontend 2>/dev/null || true
    pm2 start ecosystem.config.js
    pm2 save
    echo "[$(date)] Frontend restarted" >> ~/pm2-keepalive.log
fi
```

Make executable:
```bash
chmod +x ~/pm2-keepalive.sh
```

### Add to Cron Job (Hostinger hPanel)

1. Go to: **Advanced** → **Cron Jobs**
2. Add new cron job:
   - **Run every**: `5 minutes`
   - **Command**: 
     ```bash
     /bin/bash /home/u379849097/pm2-keepalive.sh >> /home/u379849097/pm2-keepalive.log 2>&1
     ```

## PM2 Management Commands

### View Logs
```bash
pm2 logs                          # All logs (live)
pm2 logs evo-tech-backend         # Backend only
pm2 logs evo-tech-frontend        # Frontend only
pm2 logs --lines 100              # Last 100 lines
```

### Restart Services
```bash
pm2 restart evo-tech-backend --update-env    # Backend with env refresh
pm2 restart evo-tech-frontend                # Frontend
pm2 restart all                              # All services
```

### Stop Services
```bash
pm2 stop evo-tech-backend
pm2 stop evo-tech-frontend
pm2 stop all
```

### Delete Services
```bash
pm2 delete evo-tech-backend
pm2 delete evo-tech-frontend
pm2 delete all
```

### Monitor Resources
```bash
pm2 monit                # Real-time monitoring
pm2 list                 # Process list
pm2 info evo-tech-backend    # Detailed info
```

## Troubleshooting

### Backend Not Starting

```bash
# Check logs
pm2 logs evo-tech-backend --err --lines 100

# Common issues:
# 1. MongoDB connection - check MONGODB_URI in ecosystem.config.js
# 2. Port conflict - ensure port 5000 is free
# 3. Missing dependencies - verify node_modules uploaded

# Restart with fresh environment
cd ~/domains/api.evo-techbd.com/public_html
pm2 delete evo-tech-backend
pm2 start ecosystem.config.js --update-env
```

### Frontend Not Loading

```bash
# Check logs
pm2 logs evo-tech-frontend --err --lines 100

# Common issues:
# 1. .next folder missing - verify upload
# 2. Port 3000 conflict
# 3. server.js not found

# Restart
cd ~/domains/evo-techbd.com/public_html
pm2 delete evo-tech-frontend
pm2 start ecosystem.config.js
```

### API Requests Failing

1. **Check subdomain DNS**:
   - Verify `api.evo-techbd.com` points to server IP
   - Wait for DNS propagation (up to 24 hours)

2. **Test backend directly**:
   ```bash
   curl http://localhost:5000/api/health
   ```

3. **Check CORS settings**:
   - Backend should allow `https://evo-techbd.com`
   - Verify in `ecosystem.config.js` → `CORS_ORIGIN`

4. **Check .htaccess** (for main domain):
   ```bash
   cat ~/domains/evo-techbd.com/public_html/.htaccess
   ```

### 502/503 Errors

```bash
# Check if services are running
pm2 list

# Check Apache/Nginx logs (in hPanel)
# Check PM2 logs
pm2 logs --err

# Restart all services
pm2 restart all
```

## Environment Variables

### Frontend (.env)
Located at: `~/domains/evo-techbd.com/public_html/.env`

```env
NODE_ENV=production
NEXT_PUBLIC_API_URL=https://api.evo-techbd.com
# Add other frontend env vars
```

### Backend (.env)
Located at: `~/domains/api.evo-techbd.com/public_html/.env`

Or configured in `ecosystem.config.js`:
```javascript
env: {
  NODE_ENV: "production",
  PORT: 5000,
  MONGODB_URI: "your-mongodb-connection-string",
  CORS_ORIGIN: "https://evo-techbd.com",
  // ... other vars
}
```

## Update Deployment

To deploy updates:

1. **Rebuild locally**:
   ```bash
   bash prepare_upload.sh
   ```

2. **Upload new files** (same as Step 2)

3. **Restart services**:
   ```bash
   ssh -p 65002 u379849097@46.202.161.130
   
   # Restart backend
   cd ~/domains/api.evo-techbd.com/public_html
   pm2 restart evo-tech-backend --update-env
   
   # Restart frontend
   cd ~/domains/evo-techbd.com/public_html
   pm2 restart evo-tech-frontend
   ```

## Performance Tips

1. **Enable Gzip Compression** - Check .htaccess
2. **CDN for Static Assets** - Consider Cloudflare
3. **Database Indexing** - Optimize MongoDB queries
4. **PM2 Clustering** - Increase instances in ecosystem.config.js
5. **Monitor Logs** - Set up log rotation

## Security Checklist

- [ ] HTTPS enabled (SSL certificate active)
- [ ] Environment variables secured
- [ ] MongoDB IP whitelist configured
- [ ] Admin passwords changed from defaults
- [ ] CORS properly configured
- [ ] Rate limiting enabled
- [ ] Input validation in place
- [ ] Regular backups scheduled

## Support

### Useful Links
- Hostinger hPanel: [https://hpanel.hostinger.com](https://hpanel.hostinger.com)
- PM2 Documentation: [https://pm2.keymetrics.io](https://pm2.keymetrics.io)
- MongoDB Atlas: [https://cloud.mongodb.com](https://cloud.mongodb.com)

### Log Locations
- PM2 Logs: `~/domains/*/public_html/logs/`
- Keep-alive Log: `~/pm2-keepalive.log`
- Apache Logs: Via Hostinger hPanel

---

**Last Updated**: February 2026  
**Node Version**: v18+  
**PM2 Version**: v5+
