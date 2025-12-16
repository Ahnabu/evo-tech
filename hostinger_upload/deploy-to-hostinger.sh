#!/bin/bash

# Quick Deployment Script for Hostinger
# Run this script AFTER uploading files to Hostinger

echo "🚀 Starting Evo-Tech Deployment..."

# Navigate to backend
cd ~/domains/evo-techbd.com/public_html/evobackend || exit 1

# Stop existing processes
pm2 delete evo-tech-backend 2>/dev/null || true
pm2 delete evo-tech-frontend 2>/dev/null || true

# Start backend
echo "Starting backend..."
pm2 start ecosystem.config.js --update-env

# Navigate to frontend
cd ~/domains/evo-techbd.com/public_html || exit 1

# Start frontend
echo "Starting frontend..."
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save

# Show status
echo ""
echo "✅ Deployment complete!"
echo ""
pm2 status

echo ""
echo "📝 Next steps:"
echo "1. Visit https://evo-techbd.com to verify"
echo "2. Check logs: pm2 logs"
echo "3. Set up keep-alive cron job (see DEPLOY_README.md)"
