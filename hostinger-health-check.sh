#!/bin/bash

# Quick Hostinger Backend Health Check
# Run this on your Hostinger server via SSH

echo "=========================================="
echo "Backend Server Health Check"
echo "=========================================="
echo ""

echo "1️⃣  PM2 Process Status:"
echo "---"
pm2 list
echo ""

echo "2️⃣  Backend Server Status:"
echo "---"
pm2 describe evo-tech-backend 2>/dev/null || echo "⚠️  Backend process not found!"
echo ""

echo "3️⃣  Recent Error Logs (Last 30 lines):"
echo "---"
pm2 logs evo-tech-backend --err --lines 30 --nostream 2>/dev/null || cat backend/logs/pm2-error.log 2>/dev/null | tail -30 || echo "No error logs found"
echo ""

echo "4️⃣  Memory Usage:"
echo "---"
free -h
echo ""

echo "5️⃣  Disk Usage:"
echo "---"
df -h | grep -E "Filesystem|/$"
echo ""

echo "6️⃣  Node Process:"
echo "---"
ps aux | grep -E "node|evo-tech" | grep -v grep || echo "No node process running!"
echo ""

echo "7️⃣  Backend Connectivity Test:"
echo "---"
if command -v curl &> /dev/null; then
    echo "Testing http://localhost:5000/health"
    curl -s -I http://localhost:5000/health 2>/dev/null || echo "❌ Backend not responding"
else
    echo "curl not available - skipping connectivity test"
fi
echo ""

echo "8️⃣  Environment Check:"
echo "---"
if [ -f "backend/.env" ]; then
    echo "✅ .env file exists"
    echo "Environment variables count: $(cat backend/.env | grep -v '^#' | grep -v '^$' | wc -l)"
else
    echo "❌ .env file not found!"
fi
echo ""

echo "=========================================="
echo "Quick Actions:"
echo "=========================================="
echo "Restart backend:  pm2 restart evo-tech-backend"
echo "View live logs:   pm2 logs evo-tech-backend"
echo "Flush logs:       pm2 flush"
echo "=========================================="
