#!/bin/bash
# Quick Hostinger Server Restart Script
# Copy and paste this into your SSH session after connecting

# Activate Node.js
source ~/.nvm/nvm.sh
export PATH="$HOME/.nvm/versions/node/v20.19.6/bin:$PATH"

# Restart backend only (quick restart)
cd ~/domains/evo-techbd.com/public_html/evobackend
pm2 restart evo-tech-backend

# Show status
pm2 list
pm2 logs --lines 20

# If full restart needed, uncomment below:
# pm2 delete all
# cd ~/domains/evo-techbd.com/public_html
# pm2 start ecosystem.config.js --name evo-tech-frontend
# cd ~/domains/evo-techbd.com/public_html/evobackend
# pm2 start ecosystem.config.js --name evo-tech-backend
# pm2 save
# pm2 list
