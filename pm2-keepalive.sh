#!/bin/bash

# PM2 Keep-Alive Script for Hostinger
# This script checks if PM2 processes are running and restarts them if needed

# Source nvm to ensure node and pm2 are available
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# Log file
LOG_FILE="$HOME/pm2-keepalive.log"

# Function to log messages
log_message() {
    echo "$(date '+%Y-%m-%d %H:%M:%S'): $1" >> "$LOG_FILE"
}

# Check if PM2 is responding and has processes
PM2_STATUS=$(pm2 jlist 2>&1)

if [ $? -ne 0 ] || [ "$PM2_STATUS" = "[]" ]; then
    log_message "PM2 processes not running or daemon down. Starting..."
    
    # Kill any stale PM2 daemon
    pm2 kill 2>/dev/null
    sleep 2
    
    # Start backend
    cd ~/domains/evo-techbd.com/public_html/evobackend
    pm2 start ecosystem.config.js
    
    # Start frontend
    cd ~/domains/evo-techbd.com/public_html
    pm2 start ecosystem.config.js
    
    # Save PM2 configuration
    pm2 save
    
    log_message "PM2 processes restarted successfully"
else
    # Check for errored or stopped processes
    ERRORED=$(echo "$PM2_STATUS" | grep -o '"status":"errored"' | wc -l)
    STOPPED=$(echo "$PM2_STATUS" | grep -o '"status":"stopped"' | wc -l)
    ONLINE=$(echo "$PM2_STATUS" | grep -o '"status":"online"' | wc -l)
    
    if [ "$ERRORED" -gt 0 ] || [ "$STOPPED" -gt 0 ]; then
        log_message "Found $ERRORED errored and $STOPPED stopped processes. Restarting problematic processes..."
        pm2 restart all
        pm2 save
        log_message "Problematic processes restarted"
    elif [ "$ONLINE" -ge 2 ]; then
        log_message "PM2 is running normally ($ONLINE processes online)"
    fi
fi
