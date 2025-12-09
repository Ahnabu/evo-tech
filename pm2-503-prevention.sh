#!/bin/bash

# 503 Error Prevention Script for Hostinger
# This script specifically addresses 503 Service Unavailable errors

# Source nvm
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# Configuration
LOG_FILE="$HOME/pm2-503-monitor.log"
BACKEND_DIR="$HOME/domains/evo-techbd.com/public_html/evobackend"
FRONTEND_DIR="$HOME/domains/evo-techbd.com/public_html"
NGINX_ERROR_LOG="/var/log/nginx/error.log"

# Function to log messages
log_message() {
    echo "$(date '+%Y-%m-%d %H:%M:%S'): $1" >> "$LOG_FILE"
}

# Check if PM2 is installed and accessible
if ! command -v pm2 &> /dev/null; then
    log_message "ERROR: PM2 not found. Installing..."
    npm install -g pm2
fi

# Get PM2 status
PM2_LIST=$(pm2 jlist 2>&1)
PM2_EXIT_CODE=$?

# Full restart if PM2 daemon is not responding
if [ $PM2_EXIT_CODE -ne 0 ]; then
    log_message "CRITICAL: PM2 daemon not responding. Performing full restart..."
    
    # Kill stale PM2 daemon
    pm2 kill 2>/dev/null
    sleep 3
    
    # Start backend
    cd "$BACKEND_DIR"
    if [ -f "ecosystem.config.js" ]; then
        pm2 start ecosystem.config.js
        log_message "Backend started"
    else
        log_message "ERROR: Backend ecosystem.config.js not found"
    fi
    
    # Start frontend
    cd "$FRONTEND_DIR"
    if [ -f "ecosystem.config.js" ]; then
        pm2 start ecosystem.config.js
        log_message "Frontend started"
    else
        log_message "ERROR: Frontend ecosystem.config.js not found"
    fi
    
    # Save and setup startup
    pm2 save --force
    pm2 startup
    
    log_message "Full PM2 restart completed"
    exit 0
fi

# Check if processes list is empty
if [ "$PM2_LIST" = "[]" ]; then
    log_message "WARNING: No PM2 processes running. Starting applications..."
    
    cd "$BACKEND_DIR"
    pm2 start ecosystem.config.js
    
    cd "$FRONTEND_DIR"
    pm2 start ecosystem.config.js
    
    pm2 save --force
    log_message "Applications started"
    exit 0
fi

# Parse process status
BACKEND_STATUS=$(echo "$PM2_LIST" | grep '"name":"evo-tech-backend"' | head -1 | grep -o '"status":"[^"]*"' | head -1 | cut -d'"' -f4)
FRONTEND_STATUS=$(echo "$PM2_LIST" | grep '"name":"evo-tech-frontend"' | head -1 | grep -o '"status":"[^"]*"' | head -1 | cut -d'"' -f4)

log_message "Backend: $BACKEND_STATUS | Frontend: $FRONTEND_STATUS"

# Restart if not online
if [ -n "$BACKEND_STATUS" ] && [ "$BACKEND_STATUS" != "online" ]; then
    log_message "Backend is $BACKEND_STATUS. Restarting..."
    pm2 restart evo-tech-backend
elif [ -z "$BACKEND_STATUS" ]; then
    log_message "Backend not found in process list. Starting..."
    cd "$BACKEND_DIR"
    pm2 start ecosystem.config.js
fi

if [ -n "$FRONTEND_STATUS" ] && [ "$FRONTEND_STATUS" != "online" ]; then
    log_message "Frontend is $FRONTEND_STATUS. Restarting..."
    pm2 restart evo-tech-frontend
elif [ -z "$FRONTEND_STATUS" ]; then
    log_message "Frontend not found in process list. Starting..."
    cd "$FRONTEND_DIR"
    pm2 start ecosystem.config.js
fi

# Check for high restart count (indicates crashing)
BACKEND_RESTARTS=$(echo "$PM2_LIST" | grep -o '"name":"evo-tech-backend"[^}]*"restart_time":[0-9]*' | grep -o '[0-9]*$')
FRONTEND_RESTARTS=$(echo "$PM2_LIST" | grep -o '"name":"evo-tech-frontend"[^}]*"restart_time":[0-9]*' | grep -o '[0-9]*$')

if [ -n "$BACKEND_RESTARTS" ] && [ "$BACKEND_RESTARTS" -gt 5 ]; then
    log_message "WARNING: Backend has restarted $BACKEND_RESTARTS times. Check logs!"
fi

if [ -n "$FRONTEND_RESTARTS" ] && [ "$FRONTEND_RESTARTS" -gt 5 ]; then
    log_message "WARNING: Frontend has restarted $FRONTEND_RESTARTS times. Check logs!"
fi

# Ensure PM2 saves state
pm2 save --force 2>/dev/null

log_message "503 prevention check completed"
