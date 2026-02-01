#!/bin/bash

# Script to check Hostinger logs for the backend server
# Run this script on your Hostinger server via SSH

echo "=== Checking PM2 Process Status ==="
pm2 list

echo -e "\n=== Checking Backend Server Logs (Last 50 lines) ==="
pm2 logs backend --lines 50 --nostream

echo -e "\n=== Checking for Memory Issues ==="
pm2 describe backend | grep -i memory

echo -e "\n=== Checking System Resources ==="
free -h
df -h

echo -e "\n=== Checking for Recent Errors in PM2 Logs ==="
pm2 logs backend --err --lines 100 --nostream | grep -i "error\|failed\|exception\|502\|timeout"

echo -e "\n=== Checking Node.js Process ==="
ps aux | grep node

echo -e "\n=== Restart Backend Server ==="
read -p "Do you want to restart the backend server? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]
then
    pm2 restart backend
    echo "Backend server restarted!"
    pm2 logs backend --lines 20
fi
