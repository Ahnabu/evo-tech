#!/bin/bash

# Emergency Fix Script for Hostinger 502 Error
# Run this directly on your Hostinger server via SSH

echo "=========================================="
echo "🚨 Emergency Backend Recovery Script"
echo "=========================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Step 1: Check current status
echo "📊 Checking current status..."
echo ""

PM2_STATUS=$(pm2 jlist 2>/dev/null | grep -o '"name":"evo-tech-backend".*"status":"[^"]*"' | grep -o '"status":"[^"]*"' | cut -d'"' -f4)

if [ "$PM2_STATUS" == "online" ]; then
    echo -e "${GREEN}✅ Backend is running${NC}"
else
    echo -e "${RED}❌ Backend is NOT running (Status: $PM2_STATUS)${NC}"
fi

# Step 2: Show recent errors
echo ""
echo "📋 Recent error logs:"
echo "-----------------------------------"
pm2 logs evo-tech-backend --err --lines 20 --nostream 2>/dev/null | tail -20
echo "-----------------------------------"
echo ""

# Step 3: Check memory
echo "💾 Memory usage:"
echo "-----------------------------------"
free -h
echo ""
pm2 describe evo-tech-backend 2>/dev/null | grep -i "memory\|uptime\|restarts" || echo "Cannot get PM2 details"
echo "-----------------------------------"
echo ""

# Step 4: Offer restart
echo -e "${YELLOW}Would you like to restart the backend now?${NC}"
read -p "Press [Enter] to restart, or Ctrl+C to cancel: "

echo ""
echo "🔄 Restarting backend..."
pm2 restart evo-tech-backend

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Backend restarted successfully!${NC}"
    echo ""
    echo "Waiting 3 seconds for startup..."
    sleep 3
    
    # Test health endpoint
    echo ""
    echo "🏥 Testing health endpoint..."
    HEALTH_CHECK=$(curl -s http://localhost:5000/health 2>/dev/null)
    
    if [ ! -z "$HEALTH_CHECK" ]; then
        echo -e "${GREEN}✅ Backend is responding!${NC}"
        echo "$HEALTH_CHECK"
    else
        echo -e "${RED}❌ Backend not responding to health check${NC}"
    fi
    
    # Show live logs
    echo ""
    echo "📺 Showing live logs (press Ctrl+C to exit)..."
    echo "-----------------------------------"
    sleep 2
    pm2 logs evo-tech-backend --lines 30
else
    echo -e "${RED}❌ Failed to restart backend${NC}"
    exit 1
fi
