#!/bin/bash

echo "=== Finding Node.js Environment ==="
if [ -d ~/nodevenv ]; then
    echo "Node virtual environment found"
    ls -la ~/nodevenv/
    
    # Find and activate the Node.js environment
    NODEENV=$(find ~/nodevenv -name "activate" | head -1)
    if [ -n "$NODEENV" ]; then
        echo "Activating: $NODEENV"
        source "$NODEENV"
    fi
fi

echo ""
echo "=== Checking Node.js ==="
which node && node -v
which npm && npm -v

echo ""
echo "=== Installing PM2 ==="
npm install -g pm2 2>/dev/null || echo "PM2 install failed, trying npx..."

echo ""
echo "=== Stopping existing PM2 processes ==="
pm2 delete all 2>/dev/null || npx pm2 delete all 2>/dev/null

echo ""
echo "=== Starting Backend Server ==="
cd ~/domains/evo-techbd.com/public_html/evobackend
if [ -f ecosystem.config.js ]; then
    echo "Found backend ecosystem.config.js"
    pm2 start ecosystem.config.js 2>/dev/null || npx pm2 start ecosystem.config.js
else
    echo "No ecosystem.config.js in evobackend"
fi

echo ""
echo "=== Starting Frontend/Root Server ==="
cd ~/domains/evo-techbd.com/public_html
if [ -f ecosystem.config.js ]; then
    echo "Found root ecosystem.config.js"
    pm2 start ecosystem.config.js 2>/dev/null || npx pm2 start ecosystem.config.js
else
    echo "No ecosystem.config.js in root"
fi

echo ""
echo "=== Saving PM2 Configuration ==="
pm2 save 2>/dev/null || npx pm2 save 2>/dev/null

echo ""
echo "=== PM2 Status ==="
pm2 list 2>/dev/null || npx pm2 list 2>/dev/null

echo ""
echo "=== Setup Complete ==="
