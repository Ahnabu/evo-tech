#!/bin/bash
# Comprehensive Hostinger Log Checker
# SSH: ssh -p 65002 u379849097@46.202.161.130

echo "=================================="
echo "🔍 HOSTINGER SERVER LOG ANALYSIS"
echo "=================================="

# Activate Node environment
source ~/.nvm/nvm.sh 2>/dev/null
export PATH="$HOME/.nvm/versions/node/v20.19.6/bin:$PATH"

echo ""
echo "📊 1. PM2 PROCESS STATUS"
echo "-----------------------------------"
pm2 list

echo ""
echo "⚠️  2. BACKEND ERROR LOGS (Last 100 lines)"
echo "-----------------------------------"
pm2 logs evo-tech-backend --err --lines 100 --nostream 2>/dev/null || echo "No backend logs found"

echo ""
echo "📝 3. BACKEND OUTPUT LOGS (Last 50 lines)"
echo "-----------------------------------"
pm2 logs evo-tech-backend --lines 50 --nostream 2>/dev/null || echo "No backend logs found"

echo ""
echo "💾 4. MEMORY USAGE"
echo "-----------------------------------"
free -h
echo ""
pm2 describe evo-tech-backend 2>/dev/null | grep -i "memory\|uptime\|restart"

echo ""
echo "🔄 5. RESTART COUNT & UPTIME"
echo "-----------------------------------"
pm2 describe evo-tech-backend 2>/dev/null | grep -E "restart time|uptime|restarts|status"

echo ""
echo "💽 6. DISK USAGE"
echo "-----------------------------------"
df -h | grep -E "Filesystem|/$|/home"

echo ""
echo "🔍 7. SEARCHING FOR SPECIFIC ERRORS"
echo "-----------------------------------"
echo "Looking for: 503, 502, ECONNREFUSED, MongoDB, heap, memory..."
pm2 logs evo-tech-backend --lines 200 --nostream 2>/dev/null | grep -iE "503|502|error|exception|econnrefused|mongodb|heap|memory|fatal|crash|killed" | tail -30

echo ""
echo "🌐 8. TEST BACKEND HEALTH ENDPOINT"
echo "-----------------------------------"
curl -s -w "\nHTTP Status: %{http_code}\nResponse Time: %{time_total}s\n" http://localhost:5000/health 2>/dev/null || echo "❌ Backend not responding"

echo ""
echo "🗄️  9. TEST MONGODB CONNECTION"
echo "-----------------------------------"
cd ~/domains/evo-techbd.com/public_html/evobackend 2>/dev/null
if [ -f "package.json" ]; then
    timeout 10 node -e "const mongoose = require('mongoose'); const uri = process.env.MONGODB_URI || 'mongodb+srv://evotechbd22:FOJ6Gw1QB07zdsvT@cluster0.yapaiux.mongodb.net/?appName=Cluster0'; mongoose.connect(uri, {serverSelectionTimeoutMS: 5000}).then(() => {console.log('✅ MongoDB Connected'); mongoose.disconnect(); process.exit(0);}).catch(err => {console.error('❌ MongoDB Error:', err.message); process.exit(1);});" 2>&1
else
    echo "❌ Backend directory not found"
fi

echo ""
echo "🔍 10. CHECK LOG FILES"
echo "-----------------------------------"
if [ -d "~/domains/evo-techbd.com/public_html/evobackend/logs" ]; then
    echo "Backend log files:"
    ls -lh ~/domains/evo-techbd.com/public_html/evobackend/logs/ 2>/dev/null
    echo ""
    echo "Latest error log entries:"
    tail -50 ~/domains/evo-techbd.com/public_html/evobackend/logs/error.log 2>/dev/null || echo "No error log file"
else
    echo "No log directory found"
fi

echo ""
echo "🔍 11. CHECK ECOSYSTEM CONFIG"
echo "-----------------------------------"
if [ -f "~/domains/evo-techbd.com/public_html/evobackend/ecosystem.config.js" ]; then
    echo "Memory limit setting:"
    grep -i "max_memory_restart" ~/domains/evo-techbd.com/public_html/evobackend/ecosystem.config.js 2>/dev/null || echo "Config file not found"
fi

echo ""
echo "=================================="
echo "✅ LOG ANALYSIS COMPLETE"
echo "=================================="
echo ""
echo "💡 Next Steps:"
echo "1. If backend is offline: pm2 start ecosystem.config.js --update-env"
echo "2. If memory issues: Increase max_memory_restart to 2G"
echo "3. If MongoDB errors: Check Atlas IP whitelist"
echo "4. Live monitor: pm2 logs evo-tech-backend"
echo ""
