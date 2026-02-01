#!/bin/bash
# Hostinger Backend Diagnostic and Fix Script
# Run this after SSH: ssh -p 65002 u379849097@46.202.161.130

echo "🔍 Diagnosing Backend Issues..."
echo "================================"

# Activate Node environment
source ~/.nvm/nvm.sh
export PATH="$HOME/.nvm/versions/node/v20.19.6/bin:$PATH"

# Check current PM2 status
echo ""
echo "📊 Current PM2 Status:"
pm2 list

# Check backend logs for crashes
echo ""
echo "❌ Recent Backend Errors (last 50 lines):"
pm2 logs evo-tech-backend --err --lines 50 --nostream

# Check if backend is restarting frequently
echo ""
echo "🔄 Backend Restart Count:"
pm2 describe evo-tech-backend | grep -E "restart time|uptime|restarts"

# Check memory usage
echo ""
echo "💾 Memory Usage:"
free -h
echo ""
pm2 describe evo-tech-backend | grep -i "memory"

# Check if MongoDB connection is working
echo ""
echo "🗄️  Testing MongoDB Connection:"
cd ~/domains/evo-techbd.com/public_html/evobackend
node -e "const mongoose = require('mongoose'); mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://evotechbd22:FOJ6Gw1QB07zdsvT@cluster0.yapaiux.mongodb.net/?appName=Cluster0').then(() => {console.log('✅ MongoDB Connected'); process.exit(0);}).catch(err => {console.error('❌ MongoDB Error:', err.message); process.exit(1);});"

# Check if port 5000 is accessible
echo ""
echo "🌐 Testing Backend Health Endpoint:"
curl -s http://localhost:5000/health || echo "❌ Backend not responding on port 5000"

echo ""
echo "================================"
echo "🛠️  FIXES TO TRY:"
echo "================================"
echo ""
echo "1. INCREASE MEMORY LIMIT (if backend keeps crashing):"
echo "   Edit: ~/domains/evo-techbd.com/public_html/evobackend/ecosystem.config.js"
echo "   Change: max_memory_restart: \"500M\" to \"1G\" or \"2G\""
echo ""
echo "2. RESTART WITH CLEAN START:"
echo "   pm2 delete evo-tech-backend"
echo "   pm2 start ecosystem.config.js --update-env"
echo "   pm2 save"
echo ""
echo "3. CHECK DATABASE WHITELIST:"
echo "   - Go to MongoDB Atlas"
echo "   - Network Access > IP Whitelist"
echo "   - Ensure 0.0.0.0/0 is whitelisted OR add Hostinger IP"
echo ""
echo "4. MONITOR LIVE LOGS:"
echo "   pm2 logs evo-tech-backend --lines 100"
echo ""
