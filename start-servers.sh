#!/bin/bash

# Evo-Tech Server Startup Script for Hostinger
# This script starts both backend and frontend servers using PM2

echo "=========================================="
echo "  EVO-TECH SERVER STARTUP"
echo "=========================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Find and activate Node.js environment
echo "🔍 Finding Node.js Environment..."
if [ -d ~/nodevenv ]; then
    NODEENV=$(find ~/nodevenv -name "activate" | head -1)
    if [ -n "$NODEENV" ]; then
        echo -e "${GREEN}✓ Activating: $NODEENV${NC}"
        source "$NODEENV"
    fi
fi

# Verify Node.js installation
echo ""
echo "📦 Checking Node.js Installation..."
NODE_VERSION=$(node -v 2>/dev/null)
NPM_VERSION=$(npm -v 2>/dev/null)

if [ -z "$NODE_VERSION" ]; then
    echo -e "${RED}✗ Node.js not found!${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Node.js: $NODE_VERSION${NC}"
echo -e "${GREEN}✓ NPM: $NPM_VERSION${NC}"

# Ensure PM2 is installed
echo ""
echo "🔧 Checking PM2..."
if ! command -v pm2 &> /dev/null; then
    echo "Installing PM2 globally..."
    npm install -g pm2
fi
PM2_VERSION=$(pm2 -v 2>/dev/null)
echo -e "${GREEN}✓ PM2: $PM2_VERSION${NC}"

# Stop all existing PM2 processes
echo ""
echo "🛑 Stopping existing PM2 processes..."
pm2 delete all 2>/dev/null
echo -e "${GREEN}✓ All processes stopped${NC}"

# Start Backend Server
echo ""
echo "=========================================="
echo "  STARTING BACKEND SERVER"
echo "=========================================="
cd ~/domains/evo-techbd.com/public_html/evobackend

if [ ! -f "dist/server.js" ]; then
    echo -e "${RED}✗ Backend build not found! Run 'npm run build' first${NC}"
    exit 1
fi

if [ -f "ecosystem.config.js" ]; then
    echo "Starting backend with PM2..."
    pm2 start ecosystem.config.js
    echo -e "${GREEN}✓ Backend server started${NC}"
else
    echo -e "${RED}✗ ecosystem.config.js not found in evobackend${NC}"
    exit 1
fi

# Start Frontend Server
echo ""
echo "=========================================="
echo "  STARTING FRONTEND SERVER"
echo "=========================================="
cd ~/domains/evo-techbd.com/public_html

if [ ! -f "server.js" ]; then
    echo -e "${RED}✗ Frontend build not found! Run 'npm run build' first${NC}"
    exit 1
fi

if [ -f "ecosystem.config.js" ]; then
    echo "Starting frontend with PM2..."
    pm2 start ecosystem.config.js
    echo -e "${GREEN}✓ Frontend server started${NC}"
else
    echo -e "${RED}✗ ecosystem.config.js not found in root${NC}"
    exit 1
fi

# Save PM2 configuration
echo ""
echo "💾 Saving PM2 Configuration..."
pm2 save
pm2 startup | tail -n 1 > /tmp/pm2_startup_command.sh 2>/dev/null
echo -e "${GREEN}✓ PM2 configuration saved${NC}"

# Display status
echo ""
echo "=========================================="
echo "  SERVER STATUS"
echo "=========================================="
pm2 list

# Display logs location
echo ""
echo "=========================================="
echo "  LOGS LOCATION"
echo "=========================================="
echo -e "${YELLOW}Backend logs:${NC} ~/domains/evo-techbd.com/public_html/evobackend/logs/"
echo -e "${YELLOW}Frontend logs:${NC} ~/domains/evo-techbd.com/public_html/logs/"
echo ""
echo -e "${YELLOW}View logs with:${NC}"
echo "  pm2 logs evo-tech-backend"
echo "  pm2 logs evo-tech-frontend"
echo "  pm2 logs --lines 100"

# Health check
echo ""
echo "=========================================="
echo "  HEALTH CHECK"
echo "=========================================="
sleep 3

# Check if processes are running
BACKEND_STATUS=$(pm2 jlist | grep -c "evo-tech-backend")
FRONTEND_STATUS=$(pm2 jlist | grep -c "evo-tech-frontend")

if [ "$BACKEND_STATUS" -gt 0 ]; then
    echo -e "${GREEN}✓ Backend is running${NC}"
else
    echo -e "${RED}✗ Backend failed to start${NC}"
fi

if [ "$FRONTEND_STATUS" -gt 0 ]; then
    echo -e "${GREEN}✓ Frontend is running${NC}"
else
    echo -e "${RED}✗ Frontend failed to start${NC}"
fi

echo ""
echo "=========================================="
echo "  STARTUP COMPLETE"
echo "=========================================="
echo ""
echo -e "${GREEN}Your application is now running!${NC}"
echo ""
echo "Useful commands:"
echo "  pm2 list              - Show all processes"
echo "  pm2 logs              - Show all logs"
echo "  pm2 restart all       - Restart all processes"
echo "  pm2 stop all          - Stop all processes"
echo "  pm2 delete all        - Delete all processes"
echo "  pm2 monit             - Monitor processes"
echo ""
