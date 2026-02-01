#!/bin/bash

# Deployment script for Hostinger after fixing 502 error
# This script should be run on your LOCAL machine

echo "=========================================="
echo "Deploying Backend Fix to Hostinger"
echo "=========================================="
echo ""

# Step 1: Build the backend
echo "1️⃣  Building backend..."
cd backend || exit 1
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed! Please fix build errors first."
    exit 1
fi

echo "✅ Build successful!"
echo ""

# Step 2: Prepare deployment package
echo "2️⃣  Preparing deployment package..."
cd ..
mkdir -p temp_backend_deploy
cp -r backend/dist temp_backend_deploy/
cp backend/package.json temp_backend_deploy/
cp backend/package-lock.json temp_backend_deploy/
cp backend/ecosystem.config.js temp_backend_deploy/
cp -r backend/logs temp_backend_deploy/ 2>/dev/null || mkdir temp_backend_deploy/logs

echo "✅ Package prepared in temp_backend_deploy/"
echo ""

# Step 3: Instructions for Hostinger deployment
echo "=========================================="
echo "Next Steps - Deploy to Hostinger:"
echo "=========================================="
echo ""
echo "Option A - Using Git (Recommended):"
echo "-----------------------------------"
echo "1. Commit and push changes:"
echo "   git add backend/src/app.ts"
echo "   git commit -m 'Fix: Add request size limits to prevent 502 errors'"
echo "   git push origin main"
echo ""
echo "2. SSH to Hostinger:"
echo "   ssh your-user@your-server.com"
echo ""
echo "3. Pull and rebuild on server:"
echo "   cd ~/public_html/backend"
echo "   git pull origin main"
echo "   npm run build"
echo "   pm2 restart evo-tech-backend"
echo ""
echo "-----------------------------------"
echo ""
echo "Option B - Manual Upload (If no Git):"
echo "-----------------------------------"
echo "1. Upload temp_backend_deploy/* to Hostinger:"
echo "   - Using FileZilla/FTP: Upload to ~/public_html/backend/"
echo "   - Using SCP: scp -r temp_backend_deploy/* user@server:~/public_html/backend/"
echo ""
echo "2. SSH to Hostinger and restart:"
echo "   ssh your-user@your-server.com"
echo "   cd ~/public_html/backend"
echo "   npm install --production"
echo "   pm2 restart evo-tech-backend"
echo ""
echo "-----------------------------------"
echo ""
echo "3️⃣  After Deployment - Verify Fix:"
echo "-----------------------------------"
echo "On Hostinger server, run:"
echo "   pm2 logs evo-tech-backend --lines 20"
echo "   curl http://localhost:5000/health"
echo ""
echo "Then test product creation from frontend:"
echo "   https://evo-techbd.com/control/products/create"
echo ""
echo "=========================================="
echo ""

# Optional: Create a tarball for easy upload
echo "4️⃣  Creating tarball for easy upload..."
cd temp_backend_deploy
tar -czf ../backend-fix.tar.gz .
cd ..

echo "✅ Created backend-fix.tar.gz"
echo ""
echo "To upload and extract on Hostinger:"
echo "1. Upload backend-fix.tar.gz to ~/public_html/"
echo "2. SSH and run:"
echo "   cd ~/public_html"
echo "   tar -xzf backend-fix.tar.gz -C backend/"
echo "   cd backend"
echo "   pm2 restart evo-tech-backend"
echo ""
echo "=========================================="
echo "Deployment package ready!"
echo "=========================================="
