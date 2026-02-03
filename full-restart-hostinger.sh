#!/bin/bash
# Complete Hostinger Server Restart Script
# Run this after SSH into: ssh -p 65002 u379849097@46.202.161.130

echo "🔄 Starting complete server restart..."

# Activate Node.js environment
echo "📦 Activating Node.js environment..."
source ~/.nvm/nvm.sh
export PATH="$HOME/.nvm/versions/node/v20.19.6/bin:$PATH"

# Verify Node version
echo "Node version: $(node -v)"
echo "PM2 version: $(pm2 -v)"

# Stop all PM2 processes
echo "⏹️  Stopping all PM2 processes..."
pm2 delete all

echo "⏳ Waiting 3 seconds..."
sleep 3

# Start Frontend
echo "🚀 Starting Frontend..."
cd ~/domains/evo-techbd.com/public_html
pm2 start ecosystem.config.js --name evo-tech-frontend

# Start Backend
echo "🚀 Starting Backend..."
cd ~/domains/api.evo-techbd.com/public_html
pm2 start ecosystem.config.js --name evo-tech-backend --update-env

# Save PM2 configuration
echo "💾 Saving PM2 configuration..."
pm2 save

echo ""
echo "✅ Restart complete!"
echo ""
echo "📊 Current Status:"
pm2 list

echo ""
echo "📝 Recent Logs:"
pm2 logs --lines 30 --nostream

echo ""
echo "🎯 To view live logs, run: pm2 logs"
echo "🔍 To check specific service: pm2 logs evo-tech-backend"
echo "🌐 Visit: https://evo-techbd.com"
