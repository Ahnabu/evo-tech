#!/bin/bash

echo "=== Node.js Check ==="
which node && node -v
which npm && npm -v

echo ""
echo "=== Running Node Processes ==="
ps aux | grep node | grep -v grep

echo ""
echo "=== PM2 Check ==="
which pm2
npx pm2 list 2>/dev/null || echo "PM2 not available"

echo ""
echo "=== Backend Directory ==="
cd ~/domains/evo-techbd.com/public_html/evobackend
ls -la

echo ""
echo "=== Log Files ==="
ls -la logs/ 2>/dev/null || echo "No logs directory"

echo ""
echo "=== Port 5000 Check ==="
netstat -tulpn 2>/dev/null | grep :5000 || echo "Nothing on port 5000"

echo ""
echo "=== All Processes ==="
ps aux | grep u379849097 | grep -v grep | head -20
