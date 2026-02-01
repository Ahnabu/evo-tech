#!/bin/bash
# Quick Fix and Deploy for Trust Proxy Issue
# Run this on your LOCAL machine

set -e

echo "🔧 Fixing Trust Proxy Issue and Deploying..."
echo "============================================"

# Build backend locally
echo "📦 Building backend..."
cd backend
npm run build
cd ..

# Create quick upload package
echo "📁 Preparing backend dist for upload..."
mkdir -p quick_fix
cp -r backend/dist quick_fix/

echo ""
echo "✅ Build complete!"
echo ""
echo "📤 Now upload to Hostinger:"
echo ""
echo "Option 1: SCP (recommended)"
echo "  scp -P 65002 -r quick_fix/dist/* u379849097@46.202.161.130:~/domains/evo-techbd.com/public_html/evobackend/dist/"
echo ""
echo "Option 2: Manual via FTP/File Manager"
echo "  Upload contents of 'quick_fix/dist/' to:"
echo "  ~/domains/evo-techbd.com/public_html/evobackend/dist/"
echo ""
echo "After upload, SSH and run:"
echo "  ssh -p 65002 u379849097@46.202.161.130"
echo "  pm2 restart evo-tech-backend"
echo "  pm2 logs evo-tech-backend --lines 20"
echo ""
