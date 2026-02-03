#!/bin/bash
# Diagnostic and Fix Script for Hostinger
# Run this on the server via SSH

echo "🔍 Starting Hostinger Diagnostics..."
echo "=================================="

# Activate Node environment
source ~/.nvm/nvm.sh
export PATH="$HOME/.nvm/versions/node/v20.19.6/bin:$PATH"

echo ""
echo "📋 Step 1: Environment Check"
echo "----------------------------"
echo "Node version: $(node -v)"
echo "NPM version: $(npm -v)"
echo "PM2 version: $(pm2 -v)"
echo "Current directory: $(pwd)"
echo "User: $(whoami)"

echo ""
echo "📋 Step 2: Checking Directory Structure"
echo "---------------------------------------"
echo "Frontend directory:"
ls -la ~/domains/evo-techbd.com/public_html/ | grep -E "(server.js|ecosystem|.next|public)"

echo ""
echo "Backend directory:"
ls -la ~/domains/evo-techbd.com/public_html/evobackend/ | grep -E "(ecosystem|dist)"

echo ""
echo "📋 Step 3: Current PM2 Status"
echo "-----------------------------"
pm2 list

echo ""
echo "📋 Step 4: Checking PM2 Logs"
echo "----------------------------"
echo "Recent PM2 logs:"
pm2 logs --nostream --lines 50

echo ""
echo "📋 Step 5: Checking .next folder"
echo "--------------------------------"
if [ -d ~/domains/evo-techbd.com/public_html/.next ]; then
    echo "✓ .next folder exists"
    echo "Contents:"
    ls -la ~/domains/evo-techbd.com/public_html/.next/
    echo ""
    echo "Static files:"
    ls -la ~/domains/evo-techbd.com/public_html/.next/static/ 2>/dev/null || echo "No static folder"
else
    echo "✗ .next folder NOT found!"
fi

echo ""
echo "📋 Step 6: Checking server.js"
echo "-----------------------------"
if [ -f ~/domains/evo-techbd.com/public_html/server.js ]; then
    echo "✓ server.js exists"
    echo "First 10 lines:"
    head -10 ~/domains/evo-techbd.com/public_html/server.js
else
    echo "✗ server.js NOT found!"
fi

echo ""
echo "📋 Step 7: Checking ecosystem.config.js files"
echo "--------------------------------------------"
echo "Frontend ecosystem config:"
if [ -f ~/domains/evo-techbd.com/public_html/ecosystem.config.js ]; then
    cat ~/domains/evo-techbd.com/public_html/ecosystem.config.js
else
    echo "✗ Frontend ecosystem.config.js NOT found!"
fi

echo ""
echo "Backend ecosystem config:"
if [ -f ~/domains/evo-techbd.com/public_html/evobackend/ecosystem.config.js ]; then
    cat ~/domains/evo-techbd.com/public_html/evobackend/ecosystem.config.js
else
    echo "✗ Backend ecosystem.config.js NOT found!"
fi

echo ""
echo "📋 Step 8: Checking Ports"
echo "------------------------"
echo "Processes listening on port 3000:"
lsof -i :3000 2>/dev/null || echo "No process on port 3000"
echo ""
echo "Processes listening on port 5000:"
lsof -i :5000 2>/dev/null || echo "No process on port 5000"

echo ""
echo "=================================="
echo "🔧 APPLYING FIXES..."
echo "=================================="

echo ""
echo "🛑 Stopping all PM2 processes..."
pm2 delete all 2>/dev/null || echo "No processes to delete"

echo ""
echo "⏳ Waiting 5 seconds..."
sleep 5

echo ""
echo "🚀 Starting Frontend..."
cd ~/domains/evo-techbd.com/public_html
if [ -f "ecosystem.config.js" ] && [ -f "server.js" ]; then
    pm2 start ecosystem.config.js --name evo-tech-frontend --update-env
    echo "✓ Frontend start command executed"
else
    echo "✗ Missing required files for frontend"
fi

echo ""
echo "🚀 Starting Backend..."
cd ~/domains/evo-techbd.com/public_html/evobackend
if [ -f "ecosystem.config.js" ]; then
    pm2 start ecosystem.config.js --name evo-tech-backend --update-env
    echo "✓ Backend start command executed"
else
    echo "✗ Missing ecosystem.config.js for backend"
fi

echo ""
echo "💾 Saving PM2 configuration..."
pm2 save

echo ""
echo "⏳ Waiting 10 seconds for services to start..."
sleep 10

echo ""
echo "=================================="
echo "📊 FINAL STATUS"
echo "=================================="
pm2 list

echo ""
echo "📝 Recent Logs (last 50 lines):"
pm2 logs --nostream --lines 50

echo ""
echo "=================================="
echo "✅ Diagnostics and fixes complete!"
echo "=================================="
echo ""
echo "🌐 Test your sites:"
echo "   Frontend: https://evo-techbd.com"
echo "   Backend:  https://api.evo-techbd.com/api/health"
echo ""
echo "📋 Useful commands:"
echo "   pm2 logs              - View live logs"
echo "   pm2 logs evo-tech-frontend - Frontend logs only"
echo "   pm2 logs evo-tech-backend  - Backend logs only"
echo "   pm2 restart all       - Restart all services"
echo "   pm2 monit             - Monitor resources"
