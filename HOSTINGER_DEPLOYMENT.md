# 🚀 Hostinger Deployment Guide - Evo-Tech

## Quick Start Commands

### 1️⃣ SSH into Hostinger
```bash
ssh u123456789@your-domain.com
# Replace with your actual SSH credentials
```

### 2️⃣ Navigate to Project Directory
```bash
cd ~/domains/evo-techbd.com/public_html
```

### 3️⃣ Start Both Servers
```bash
bash start-servers.sh
```

---

## 📋 Detailed Deployment Steps

### Initial Setup (First Time Only)

#### 1. Upload Code to Hostinger
Your directory structure should be:
```
~/domains/evo-techbd.com/public_html/
├── evobackend/           # Backend code
│   ├── dist/             # Built backend
│   ├── ecosystem.config.js
│   └── package.json
├── server.js             # Frontend standalone server
├── .next/                # Frontend build
├── public/               # Static assets
├── ecosystem.config.js   # Frontend PM2 config
└── start-servers.sh      # Startup script
```

#### 2. Install Dependencies

**Backend:**
```bash
cd ~/domains/evo-techbd.com/public_html/evobackend
npm install --production
```

**Frontend:**
```bash
cd ~/domains/evo-techbd.com/public_html
npm install --production
```

#### 3. Set Environment Variables

**Backend (.env):**
```bash
cd ~/domains/evo-techbd.com/public_html/evobackend
nano .env
```

Add your environment variables:
```env
NODE_ENV=production
PORT=5000
DATABASE_URL=your_mongodb_connection_string
JWT_ACCESS_SECRET=your_jwt_secret
# ... other variables
```

**Frontend (.env.local):**
```bash
cd ~/domains/evo-techbd.com/public_html
nano .env.local
```

Add:
```env
NEXT_PUBLIC_API_URL=https://evo-techbd.com/api/backend
NEXTAUTH_URL=https://evo-techbd.com
NEXTAUTH_SECRET=your_nextauth_secret
# ... other variables
```

---

## 🎯 Starting the Servers

### Option 1: Use the Startup Script (Recommended)
```bash
cd ~/domains/evo-techbd.com/public_html
bash start-servers.sh
```

### Option 2: Manual Start

**Start Backend:**
```bash
cd ~/domains/evo-techbd.com/public_html/evobackend
pm2 start ecosystem.config.js
```

**Start Frontend:**
```bash
cd ~/domains/evo-techbd.com/public_html
pm2 start ecosystem.config.js
```

**Save PM2 Configuration:**
```bash
pm2 save
pm2 startup
```

---

## 🔍 Monitoring & Management

### Check Server Status
```bash
pm2 list
```

### View Logs
```bash
# All logs
pm2 logs

# Backend logs only
pm2 logs evo-tech-backend

# Frontend logs only
pm2 logs evo-tech-frontend

# Last 100 lines
pm2 logs --lines 100

# Real-time monitoring
pm2 monit
```

### Restart Servers
```bash
# Restart all
pm2 restart all

# Restart backend only
pm2 restart evo-tech-backend

# Restart frontend only
pm2 restart evo-tech-frontend
```

### Stop Servers
```bash
# Stop all
pm2 stop all

# Stop specific server
pm2 stop evo-tech-backend
pm2 stop evo-tech-frontend
```

### Delete Processes
```bash
# Delete all processes
pm2 delete all

# Delete specific process
pm2 delete evo-tech-backend
```

---

## 🔄 Updating Code

### Update Backend
```bash
cd ~/domains/evo-techbd.com/public_html/evobackend

# Pull latest code or upload new files
# Then rebuild
npm run build

# Restart backend
pm2 restart evo-tech-backend
```

### Update Frontend
```bash
cd ~/domains/evo-techbd.com/public_html

# Pull latest code or upload new files
# Frontend should already be built

# Restart frontend
pm2 restart evo-tech-frontend
```

---

## 🛠️ Troubleshooting

### Servers Not Starting

1. **Check if build exists:**
```bash
# Backend
ls ~/domains/evo-techbd.com/public_html/evobackend/dist/server.js

# Frontend
ls ~/domains/evo-techbd.com/public_html/server.js
```

2. **Check environment variables:**
```bash
# Backend
cat ~/domains/evo-techbd.com/public_html/evobackend/.env

# Frontend
cat ~/domains/evo-techbd.com/public_html/.env.local
```

3. **Check PM2 logs:**
```bash
pm2 logs --err
```

4. **Check Node.js version:**
```bash
node -v  # Should be v18 or higher
```

### Port Already in Use
```bash
# Find process using port
lsof -i :5000  # Backend
lsof -i :3000  # Frontend

# Kill process
kill -9 <PID>
```

### Database Connection Issues
```bash
# Test MongoDB connection
cd ~/domains/evo-techbd.com/public_html/evobackend
node -e "const mongoose = require('mongoose'); mongoose.connect(process.env.DATABASE_URL).then(() => console.log('Connected')).catch(err => console.error(err))"
```

### Memory Issues
```bash
# Check PM2 memory usage
pm2 list

# If memory is high, restart
pm2 restart all
```

---

## 📊 Performance Monitoring

### Real-time Monitoring
```bash
pm2 monit
```

### Process Information
```bash
pm2 show evo-tech-backend
pm2 show evo-tech-frontend
```

### System Resource Usage
```bash
top
htop  # If available
```

---

## 🔐 Security Checklist

- ✅ Environment variables set correctly
- ✅ Production mode enabled (NODE_ENV=production)
- ✅ API rate limiting active
- ✅ CORS configured properly
- ✅ JWT secrets are strong and unique
- ✅ Database credentials secured
- ✅ File upload limits configured

---

## 🌐 DNS & Domain Configuration

Make sure your DNS points to:
- **Frontend**: Your main domain (evo-techbd.com)
- **Backend**: Subdomain or path (/api/backend)

### Nginx/Apache Configuration
You may need to configure reverse proxy:

**For Backend API:**
```nginx
location /api/backend {
    proxy_pass http://localhost:5000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
}
```

**For Frontend:**
```nginx
location / {
    proxy_pass http://localhost:3000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
}
```

---

## 📱 Health Checks

### Backend Health
```bash
curl http://localhost:5000/health
```

Expected response:
```json
{
  "success": true,
  "message": "Server is healthy",
  "timestamp": "2026-01-04T...",
  "uptime": 123.45,
  "environment": "production"
}
```

### Frontend Health
```bash
curl http://localhost:3000
```

---

## 🔄 Auto-Restart on Server Reboot

PM2 can automatically restart your apps after server reboot:

```bash
pm2 startup
# Follow the command output instructions

pm2 save
```

---

## 📞 Quick Reference

| Command | Description |
|---------|-------------|
| `pm2 list` | Show all processes |
| `pm2 logs` | View logs |
| `pm2 restart all` | Restart all servers |
| `pm2 stop all` | Stop all servers |
| `pm2 delete all` | Remove all processes |
| `pm2 monit` | Real-time monitoring |
| `pm2 save` | Save process list |
| `pm2 flush` | Clear logs |

---

## 🆘 Emergency Commands

### Complete Reset
```bash
pm2 kill
pm2 flush
cd ~/domains/evo-techbd.com/public_html
bash start-servers.sh
```

### View Error Logs
```bash
tail -f ~/domains/evo-techbd.com/public_html/evobackend/logs/pm2-error.log
tail -f ~/domains/evo-techbd.com/public_html/logs/pm2-error.log
```

---

## ✅ Post-Deployment Checklist

- [ ] Both servers are running (`pm2 list` shows "online")
- [ ] No errors in logs (`pm2 logs`)
- [ ] Backend health endpoint responds
- [ ] Frontend loads in browser
- [ ] Database connection works
- [ ] API calls from frontend to backend work
- [ ] File uploads work
- [ ] Authentication works
- [ ] PM2 auto-startup configured

---

## 📝 Notes

- PM2 will automatically restart crashed processes
- Logs are rotated to prevent disk space issues
- Memory limits are configured (1GB backend, 500MB frontend)
- Rate limiting is active to protect against abuse

**Need Help?** Check logs first with `pm2 logs` - they usually show what went wrong!
