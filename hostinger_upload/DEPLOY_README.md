# Evo-Tech Hostinger Deployment Guide

## 📦 Package Contents

This folder contains a production-ready build of the Evo-Tech application for Hostinger deployment.

*✨ IMPORTANT: All node_modules are pre-installed! No npm install required on the server.*

## 📁 Directory Structure


public_html/
├── .env                          # Frontend environment variables
├── .htaccess                     # Apache proxy configuration
├── server.js                     # Next.js standalone server
├── package.json                  # Frontend dependencies
├── node_modules/                 # Frontend dependencies (PRE-INSTALLED)
├── ecosystem.config.js           # PM2 config for frontend
├── .next/                        # Next.js build output
│   ├── standalone/               # Standalone server files
│   └── static/                   # Static assets
├── public/                       # Public assets (images, icons)
├── logs/                         # Frontend logs directory
└── evobackend/                   # Backend application
    ├── .env                      # Backend environment variables
    ├── package.json              # Backend dependencies
    ├── node_modules/             # Backend dependencies (PRE-INSTALLED)
    ├── ecosystem.config.js       # PM2 config for backend
    ├── dist/                     # Compiled backend code
    ├── public/                   # Backend public files
    └── logs/                     # Backend logs directory


## 🚀 Deployment Steps

### 1. Upload Files to Hostinger

Upload the entire contents of public_html/ folder to:

~/domains/evo-techbd.com/public_html/


*Methods:*
- FTP/SFTP (FileZilla, WinSCP)
- Hostinger File Manager
- SSH with SCP:
  bash
  scp -P 65002 -r public_html/* u379849097@46.202.161.130:~/domains/evo-techbd.com/public_html/
  

### 2. SSH into Hostinger

bash
ssh -p 65002 u379849097@46.202.161.130


### 3. Start Applications with PM2

*Start Backend:*
bash
cd ~/domains/evo-techbd.com/public_html/evobackend
pm2 delete evo-tech-backend 2>/dev/null || true
pm2 start ecosystem.config.js --update-env


*Start Frontend:*
bash
cd ~/domains/evo-techbd.com/public_html
pm2 delete evo-tech-frontend 2>/dev/null || true
pm2 start ecosystem.config.js


*Save PM2 Configuration:*
bash
pm2 save


### 4. Verify Deployment

*Check PM2 Status:*
bash
pm2 list
pm2 logs


*Expected Output:*

┌────┬──────────────────────┬─────────┬─────────┬─────────┬──────────┐
│ id │ name                 │ version │ mode    │ pid     │ status   │
├────┼──────────────────────┼─────────┼─────────┼─────────┼──────────┤
│ 0  │ evo-tech-backend     │ 1.0.0   │ cluster │ 123456  │ online   │
│ 1  │ evo-tech-frontend    │ 1.1.0   │ cluster │ 123457  │ online   │
└────┴──────────────────────┴─────────┴─────────┴─────────┴──────────┘


*Test Website:*
- Visit: https://evo-techbd.com
- Test login/logout
- Verify API requests work

## 🔧 PM2 Commands

*View Logs:*
bash
pm2 logs                    # All logs
pm2 logs evo-tech-backend   # Backend only
pm2 logs evo-tech-frontend  # Frontend only


*Restart Services:*
bash
pm2 restart evo-tech-backend --update-env
pm2 restart evo-tech-frontend
pm2 restart all


*Stop Services:*
bash
pm2 stop evo-tech-backend
pm2 stop evo-tech-frontend
pm2 stop all


*Delete Services:*
bash
pm2 delete evo-tech-backend
pm2 delete evo-tech-frontend
pm2 delete all


## 🛡 PM2 Keep-Alive (Auto-Restart)

The PM2 keep-alive script should already be configured. To verify:

1. Check if script exists:
bash
ls -la ~/pm2-keepalive.sh


2. Verify cron job in Hostinger hPanel:
   - Go to: *Advanced* → *Cron Jobs*
   - Should see: */5 * * * * /bin/bash /home/u379849097/pm2-keepalive.sh >> /home/u379849097/pm2-keepalive.log 2>&1

## 🔑 Important Notes

- *Backend Environment Variables:* All environment variables are included in ecosystem.config.js for the backend
- *Frontend Port:* 3000 (proxied via .htaccess)
- *Backend Port:* 5000 (proxied via .htaccess)
- **Always use --update-env** when restarting backend to load environment variables
- *Database:* MongoDB Atlas (already configured)
- *Admin Credentials:* admin@evotech.com / admin123

## 🐛 Troubleshooting

*Backend shows 503 error:*
bash
# Check PM2 status
pm2 list
pm2 logs evo-tech-backend

# Restart if needed
pm2 restart evo-tech-backend --update-env


*Frontend not loading:*
bash
# Check PM2 status
pm2 list

# Check logs
pm2 logs evo-tech-frontend

# Restart if needed
pm2 restart evo-tech-frontend


*Database connection errors:*
- Verify MONGODB_URI in backend ecosystem.config.js
- Check MongoDB Atlas IP whitelist (should allow all: 0.0.0.0/0)
- Restart backend with: pm2 restart evo-tech-backend --update-env

## 📞 Support

For issues, check:
1. PM2 logs: pm2 logs
2. Apache error logs in Hostinger hPanel
3. Keep-alive logs: tail -f ~/pm2-keepalive.log

---

*Deployment Date:* $(date)
*Node Version Required:* v18.x or higher
*PM2 Version Required:* v5.x or higher
