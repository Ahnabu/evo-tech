# 🚀 Hostinger Deployment - Quick Command Reference

## Pre-Deployment (Local)

```bash
# Verify deployment readiness
./verify-deployment.sh

# Test build locally
npm run build

# Test standalone build
BUILD_STANDALONE=true npm run build
```

## Initial Deployment (On Hostinger Server)

```bash
# 1. Clone repository
git clone https://github.com/Ahnabu/evo-tech.git
cd evo-tech/frontend

# 2. Setup environment
cp .env.production.example .env.production
nano .env.production  # Edit with your production values

# 3. Install Node.js (if needed)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 4. Install PM2 globally
sudo npm install -g pm2

# 5. Deploy
chmod +x deploy.sh post-build.sh verify-deployment.sh
./deploy.sh

# 6. Save PM2 configuration
pm2 save
pm2 startup  # Follow the instructions it provides
```

## Regular Deployment Commands

```bash
# Full deploy (pull, install, build, restart)
./deploy.sh

# Or manual deployment:
git pull origin main
npm install
BUILD_STANDALONE=true npm run build
pm2 restart evo-tech-frontend
```

## PM2 Management

```bash
# Start application
pm2 start ecosystem.config.js
# or
npm run pm2:start

# Restart application
pm2 restart evo-tech-frontend
# or
npm run pm2:restart

# Stop application
pm2 stop evo-tech-frontend
# or
npm run pm2:stop

# View logs (live)
pm2 logs evo-tech-frontend
# or
npm run pm2:logs

# View logs (last 100 lines)
pm2 logs evo-tech-frontend --lines 100

# Monitor resources
pm2 monit

# Check status
pm2 status
pm2 list

# Delete from PM2
pm2 delete evo-tech-frontend

# Save configuration
pm2 save

# Setup auto-start on boot
pm2 startup
```

## Apache Configuration

```bash
# Enable required modules
sudo a2enmod proxy
sudo a2enmod proxy_http
sudo a2enmod rewrite
sudo systemctl restart apache2

# Edit virtual host
sudo nano /etc/apache2/sites-available/yourdomain.conf

# Enable site
sudo a2ensite yourdomain.conf
sudo systemctl reload apache2
```

## SSL Certificate (Let's Encrypt)

```bash
# Install Certbot
sudo apt install certbot python3-certbot-apache

# Get SSL certificate
sudo certbot --apache -d yourdomain.com -d www.yourdomain.com

# Renew certificate (test)
sudo certbot renew --dry-run

# Renew certificate (production)
sudo certbot renew
```

## Health Checks

```bash
# Check application health
curl http://localhost:3000/api/health

# Check with domain
curl https://yourdomain.com/api/health

# Expected response:
# {"status":"ok","timestamp":"...","environment":"production","version":"1.1.0"}
```

## Troubleshooting

```bash
# Check if port is in use
lsof -i :3000
netstat -tulpn | grep :3000

# Kill process on port 3000
kill -9 $(lsof -t -i:3000)

# Clear build cache
rm -rf .next node_modules package-lock.json
npm install
BUILD_STANDALONE=true npm run build

# Check PM2 errors
pm2 logs evo-tech-frontend --err --lines 50

# Check system resources
free -h  # Memory
df -h    # Disk space
top      # CPU usage

# Restart everything
pm2 restart evo-tech-frontend
sudo systemctl restart apache2

# Check Apache logs
sudo tail -f /var/log/apache2/error.log
sudo tail -f /var/log/apache2/access.log
```

## File Permissions

```bash
# Fix ownership
sudo chown -R $USER:$USER ~/evo-tech

# Fix permissions
find ~/evo-tech/frontend -type d -exec chmod 755 {} \;
find ~/evo-tech/frontend -type f -exec chmod 644 {} \;

# Make scripts executable
chmod +x ~/evo-tech/frontend/*.sh
```

## Environment Variables

```bash
# Edit production environment
nano .env.production

# View current environment (in PM2)
pm2 env evo-tech-frontend

# Restart after env changes
pm2 restart evo-tech-frontend
```

## Updates & Maintenance

```bash
# Update application
cd ~/evo-tech/frontend
git pull origin main
npm install
BUILD_STANDALONE=true npm run build
pm2 restart evo-tech-frontend

# Update Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Update PM2
sudo npm install -g pm2@latest
pm2 update

# Clean up old builds
rm -rf .next/cache

# View disk usage
du -sh .next node_modules
```

## Backup

```bash
# Backup current deployment
cd ~
tar -czf evo-tech-backup-$(date +%Y%m%d).tar.gz evo-tech/frontend

# Backup environment file
cp evo-tech/frontend/.env.production evo-tech-frontend-env-backup

# List backups
ls -lh evo-tech-backup-*.tar.gz
```

## Rollback

```bash
# Rollback to previous Git version
cd ~/evo-tech/frontend
git log --oneline -n 10  # View recent commits
git checkout <commit-hash>
npm install
BUILD_STANDALONE=true npm run build
pm2 restart evo-tech-frontend

# Or restore from backup
cd ~
tar -xzf evo-tech-backup-20251125.tar.gz
cd evo-tech/frontend
pm2 restart evo-tech-frontend
```

## Logs Management

```bash
# View PM2 logs
tail -f logs/pm2-out.log
tail -f logs/pm2-error.log

# Clear old logs
> logs/pm2-out.log
> logs/pm2-error.log

# Rotate logs (if pm2-logrotate installed)
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7
```

## Performance Monitoring

```bash
# PM2 metrics
pm2 monit

# System metrics
htop  # or top

# Network connections
ss -tuln | grep 3000

# Check memory leaks
pm2 logs evo-tech-frontend | grep -i "memory"
```

## Quick Fixes

```bash
# App not responding
pm2 restart evo-tech-frontend

# Port conflict
lsof -i :3000
kill -9 $(lsof -t -i:3000)
pm2 restart evo-tech-frontend

# High memory usage
pm2 restart evo-tech-frontend

# 502 Bad Gateway
pm2 status  # Check if running
pm2 logs evo-tech-frontend  # Check for errors
sudo systemctl restart apache2
```

---

## 📚 Documentation References

- **Quick Start:** `QUICK_START.md`
- **Full Guide:** `HOSTINGER_DEPLOYMENT.md`
- **Checklist:** `DEPLOYMENT_CHECKLIST.md`
- **Build Status:** `BUILD_COMPLETE.md`

---

**💡 Tip:** Bookmark this file for quick reference during deployment and maintenance!
