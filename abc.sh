#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Starting Hostinger Production Deployment Process...${NC}"
echo "=================================================="

# Step 1: Clean previous builds
echo -e "${YELLOW}📦 Step 1: Cleaning previous builds...${NC}"
rm -rf hostinger_upload
rm -rf frontend/.next
rm -rf backend/dist
echo -e "${GREEN}✓ Cleaned${NC}"

# Step 2: Build Frontend
echo -e "${YELLOW}📦 Step 2: Building Frontend (Next.js)...${NC}"
cd frontend
export BUILD_STANDALONE=true
# Make sure all dependencies are installed (including dev deps needed for build)
npm install
npm run build
cd ..
echo -e "${GREEN}✓ Frontend built${NC}"

# Step 3: Create upload directory structure
echo -e "${YELLOW}📦 Step 3: Creating upload directory structure...${NC}"
mkdir -p hostinger_upload/public_html
mkdir -p hostinger_upload/public_html/evobackend
mkdir -p hostinger_upload/public_html/logs
mkdir -p hostinger_upload/public_html/evobackend/logs
echo -e "${GREEN}✓ Directory structure created${NC}"

# Step 4: Install Frontend Production Dependencies for upload
echo -e "${YELLOW}📦 Step 4: Installing Frontend production dependencies for upload...${NC}"
cd frontend
# Clean node_modules and install only production dependencies
rm -rf node_modules
npm install --production --omit=dev
cd ..
echo -e "${GREEN}✓ Frontend production dependencies installed${NC}"

# Step 5: Copy Frontend files
echo -e "${YELLOW}📦 Step 5: Copying Frontend to upload directory...${NC}"

# Copy standalone build (this includes server.js and .next folder structure)
cp -r frontend/.next/standalone/* hostinger_upload/public_html/

# Copy static files into the standalone's .next directory
mkdir -p hostinger_upload/public_html/.next
cp -r frontend/.next/static hostinger_upload/public_html/.next/

# Copy public directory to standalone's public
cp -r frontend/public hostinger_upload/public_html/

# Copy frontend package files
cp frontend/package.json hostinger_upload/public_html/
cp frontend/package-lock.json hostinger_upload/public_html/ 2>/dev/null || true

# Copy frontend node_modules
echo -e "${YELLOW}   Copying frontend node_modules (this may take a while)...${NC}"
cp -r frontend/node_modules hostinger_upload/public_html/
echo -e "${GREEN}✓ Frontend node_modules copied${NC}"

# Copy frontend .env
if [ -f "frontend/.env.production" ]; then
    cp frontend/.env.production hostinger_upload/public_html/.env
    echo -e "${GREEN}✓ Frontend .env copied${NC}"
elif [ -f "frontend/.env" ]; then
    cp frontend/.env hostinger_upload/public_html/.env
    echo -e "${GREEN}✓ Frontend .env copied${NC}"
else
    echo -e "${RED}⚠  No frontend .env file found${NC}"
fi

echo -e "${GREEN}✓ Frontend files copied${NC}"

# Step 6: Build and Copy Backend
echo -e "${YELLOW}📦 Step 6: Building and copying Backend...${NC}"

# Make sure all dependencies are installed for build
cd backend
npm install
npm run build
cd ..

# Install Backend Production Dependencies for upload
echo -e "${YELLOW}   Installing Backend production dependencies for upload...${NC}"
cd backend
# Clean node_modules and install only production dependencies
rm -rf node_modules
npm install --production --omit=dev
cd ..
echo -e "${GREEN}✓ Backend production dependencies installed${NC}"

# Copy backend files
cp -r backend/dist hostinger_upload/public_html/evobackend/
cp backend/package.json hostinger_upload/public_html/evobackend/
cp backend/package-lock.json hostinger_upload/public_html/evobackend/ 2>/dev/null || true

# Copy backend node_modules
echo -e "${YELLOW}   Copying backend node_modules (this may take a while)...${NC}"
cp -r backend/node_modules hostinger_upload/public_html/evobackend/
echo -e "${GREEN}✓ Backend node_modules copied${NC}"

# Copy backend public directory if exists
if [ -d "backend/public" ]; then
    cp -r backend/public hostinger_upload/public_html/evobackend/
fi

# Copy backend .env
if [ -f "backend/.env.production" ]; then
    cp backend/.env.production hostinger_upload/public_html/evobackend/.env
    echo -e "${GREEN}✓ Backend .env copied${NC}"
elif [ -f "backend/.env" ]; then
    cp backend/.env hostinger_upload/public_html/evobackend/.env
    echo -e "${GREEN}✓ Backend .env copied${NC}"
else
    echo -e "${RED}⚠  No backend .env file found${NC}"
fi

echo -e "${GREEN}✓ Backend files copied${NC}"

# Step 7: Create Frontend PM2 config
echo -e "${YELLOW}📦 Step 7: Creating Frontend PM2 config...${NC}"
cat > hostinger_upload/public_html/ecosystem.config.js << 'EOF'
module.exports = {
  apps: [
    {
      name: "evo-tech-frontend",
      script: "./server.js",
      cwd: "/home/u379849097/domains/evo-techbd.com/public_html",
      instances: 1,
      exec_mode: "cluster",
      autorestart: true,
      watch: false,
      max_memory_restart: "500M",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
        HOSTNAME: "0.0.0.0"
      },
      error_file: "./logs/error.log",
      out_file: "./logs/out.log",
      merge_logs: true,
      log_date_format: "YYYY-MM-DD HH:mm:ss Z"
    }
  ]
};
EOF
echo -e "${GREEN}✓ Frontend PM2 config created${NC}"

# Step 8: Create Backend PM2 config with all environment variables
echo -e "${YELLOW}📦 Step 8: Creating Backend PM2 config...${NC}"
cat > hostinger_upload/public_html/evobackend/ecosystem.config.js << 'EOF'
module.exports = {
  apps: [
    {
      name: "evo-tech-backend",
      script: "./dist/server.js",
      cwd: "/home/u379849097/domains/evo-techbd.com/public_html/evobackend",
      instances: 1,
      exec_mode: "cluster",
      autorestart: true,
      watch: false,
      max_memory_restart: "500M",
      env: {
        NODE_ENV: "production",
        PORT: 5000,
        MONGODB_URI: "mongodb+srv://evotechbd22:FOJ6Gw1QB07zdsvT@cluster0.yapaiux.mongodb.net/?appName=Cluster0",
        JWT_ACCESS_SECRET: "13242af6503ed5d1e158620ebf0e3432331fe356ea4879af1658893541e0ec67",
        JWT_REFRESH_SECRET: "cb7083cc7f51564a4fe4931a44ecc81f2e8a36e93af9c0126617336f1aa95ade",
        JWT_REFRESH_EXPIRES_IN: "30d",
        BCRYPT_SALT_ROUNDS: "12",
        ADMIN_EMAIL: "admin@evotech.com",
        ADMIN_PASSWORD: "admin123",
        ADMIN_FIRSTNAME: "Admin",
        ADMIN_LASTNAME: "User",
        ADMIN_PHONE: "+1234567890",
        CLOUDINARY_CLOUD_NAME: "evo-tech",
        CLOUDINARY_API_KEY: "931291684898585",
        CLOUDINARY_API_SECRET: "ahnQeDoLp8cTmpVXKbHkg5Mp8W0",
        CORS_ORIGIN: "https://evo-techbd.com",
        FRONTEND_URL: "https://evo-techbd.com",
        BKASH_BASE_URL: "https://tokenized.pay.bka.sh/v1.2.0-beta",
        BKASH_APP_KEY: "your-production-bkash-app-key",
        BKASH_APP_SECRET: "your-production-bkash-app-secret",
        BKASH_USERNAME: "your-production-bkash-username",
        BKASH_PASSWORD: "your-production-bkash-password"
      },
      error_file: "./logs/error.log",
      out_file: "./logs/out.log",
      merge_logs: true,
      log_date_format: "YYYY-MM-DD HH:mm:ss Z"
    }
  ]
};
EOF
echo -e "${GREEN}✓ Backend PM2 config created${NC}"

# Step 9: Create .htaccess file
echo -e "${YELLOW}📦 Step 9: Creating .htaccess file...${NC}"
cat > hostinger_upload/public_html/.htaccess << 'EOF'
# Force HTTPS
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# Proxy API requests to backend (port 5000)
RewriteCond %{REQUEST_URI} ^/api/
RewriteRule ^(.*)$ http://127.0.0.1:5000/$1 [P,L]

# Proxy all other requests to frontend (port 3000)
RewriteCond %{REQUEST_URI} !^/api/
RewriteRule ^(.*)$ http://127.0.0.1:3000/$1 [P,L]

# Enable proxy
ProxyPreserveHost On
ProxyTimeout 600

# Security headers
Header set X-Content-Type-Options "nosniff"
Header set X-Frame-Options "SAMEORIGIN"
Header set X-XSS-Protection "1; mode=block"

# Compression
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript application/json
</IfModule>

# Browser caching
<IfModule mod_expires.c>
    ExpiresActive On
    ExpiresByType image/jpg "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
    ExpiresByType image/gif "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/svg+xml "access plus 1 year"
    ExpiresByType text/css "access plus 1 month"
    ExpiresByType application/javascript "access plus 1 month"
</IfModule>
EOF
echo -e "${GREEN}✓ .htaccess created${NC}"

# Step 10: Create deployment README
echo -e "${YELLOW}📦 Step 10: Creating deployment README...${NC}"
cat > hostinger_upload/DEPLOY_README.md << 'EOF'
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
EOF
echo -e "${GREEN}✓ Deployment README created${NC}"

# Final summary
echo ""
echo "=================================================="
echo -e "${GREEN}✅ DEPLOYMENT PACKAGE READY!${NC}"
echo "=================================================="
echo ""
echo -e "${BLUE}📁 Files prepared in: ./hostinger_upload/public_html${NC}"
echo ""
echo -e "${YELLOW}📋 Next Steps:${NC}"
echo "1. Upload contents of './hostinger_upload/public_html' to Hostinger:"
echo "   Target: ~/domains/evo-techbd.com/public_html/"
echo "   (Note: node_modules are already included - no npm install needed!)"
echo ""
echo "2. SSH into Hostinger:"
echo "   ssh -p 65002 u379849097@46.202.161.130"
echo ""
echo "3. Start applications with PM2:"
echo "   cd ~/domains/evo-techbd.com/public_html/evobackend"
echo "   pm2 start ecosystem.config.js --update-env"
echo "   cd ~/domains/evo-techbd.com/public_html"
echo "   pm2 start ecosystem.config.js"
echo "   pm2 save"
echo ""
echo "4. Verify:"
echo "   pm2 status"
echo "   Visit: https://evo-techbd.com"
echo ""
echo "=================================================="
echo -e "${GREEN}✨ Package includes:${NC}"
echo "  ✅ Frontend node_modules (pre-installed)"
echo "  ✅ Backend node_modules (pre-installed)"
echo "  ✅ Production-ready builds"
echo "  ✅ All configuration files"
echo "  ✅ PM2 configs with environment variables"
echo "=================================================="