# Hostinger Quick Start Guide

## Prerequisites Checklist
- ✅ Node.js 18+ installed on server
- ✅ PM2 process manager
- ✅ SSH access to Hostinger server
- ✅ Domain configured and pointing to server

## Quick Deployment Steps

### 1. First-Time Setup on Server

```bash
# SSH into your server
ssh username@your-server-ip

# Install Node.js (if not installed)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 globally
sudo npm install -g pm2

# Clone or upload your project
cd ~
git clone https://github.com/Ahnabu/evo-tech.git
cd evo-tech/frontend
```

### 2. Configure Environment Variables

```bash
# Create production environment file
cp .env.production.example .env.production

# Edit with your actual values
nano .env.production
```

**Required Variables:**
```env
NEXT_PUBLIC_BACKEND_URL=https://api.evo-techbd.com/api/v1
NEXT_PUBLIC_API_URL=https://api.evo-techbd.com/api/v1
NEXT_PUBLIC_FEND_URL=https://yourdomain.com
NEXTAUTH_SECRET=<generate-with-openssl-rand-base64-32>
AUTH_SECRET=<same-as-nextauth-secret>
NEXTAUTH_URL=https://yourdomain.com
NODE_ENV=production
PORT=3000
BUILD_STANDALONE=true
```

### 3. Deploy

```bash
# Make deploy script executable
chmod +x deploy.sh

# Run deployment
./deploy.sh
```

**OR manually:**
```bash
# Install dependencies
npm install

# Build for production
npm run build:hostinger

# Start with PM2
npm run pm2:start
```

### 4. Configure Web Server

#### For Apache (Default on Hostinger):

1. Enable required modules:
```bash
sudo a2enmod proxy
sudo a2enmod proxy_http
sudo a2enmod rewrite
sudo systemctl restart apache2
```

2. Configure virtual host:
```apache
<VirtualHost *:80>
    ServerName yourdomain.com
    ServerAlias www.yourdomain.com

    ProxyPreserveHost On
    ProxyPass / http://localhost:3000/
    ProxyPassReverse / http://localhost:3000/

    ErrorLog ${APACHE_LOG_DIR}/evo-tech-error.log
    CustomLog ${APACHE_LOG_DIR}/evo-tech-access.log combined
</VirtualHost>
```

3. Enable SSL (Recommended):
```bash
sudo certbot --apache -d yourdomain.com -d www.yourdomain.com
```

### 5. Verify Deployment

```bash
# Check PM2 status
pm2 status

# View logs
pm2 logs evo-tech-frontend

# Test the application
curl http://localhost:3000/api/health
```

## Useful Commands

```bash
# View application logs
npm run pm2:logs

# Restart application
npm run pm2:restart

# Stop application
npm run pm2:stop

# Redeploy (pull, build, restart)
./deploy.sh

# Check PM2 processes
pm2 list

# Monitor resources
pm2 monit

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup
```

## Troubleshooting

### Port Already in Use
```bash
# Find process on port 3000
lsof -i :3000

# Kill process
kill -9 <PID>

# Or change port in .env.production and ecosystem.config.js
```

### Build Errors
```bash
# Clear build cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Rebuild
npm run build:hostinger
```

### Memory Issues
```bash
# Increase memory limit in ecosystem.config.js
# Edit max_memory_restart value

# Or set NODE_OPTIONS
export NODE_OPTIONS="--max-old-space-size=4096"
npm run build:hostinger
```

### Permission Errors
```bash
# Fix ownership
sudo chown -R $USER:$USER ~/evo-tech

# Fix permissions
chmod -R 755 ~/evo-tech
```

## Health Checks

The application includes a health check endpoint:
- **URL:** `/api/health`
- **Method:** GET
- **Response:** `{"status": "ok", "timestamp": "..."}`

Use this for monitoring tools or load balancers.

## Updates

To update your application:

```bash
cd ~/evo-tech/frontend
./deploy.sh
```

Or manually:
```bash
git pull origin main
npm install
npm run build:hostinger
pm2 restart evo-tech-frontend
```

## Support Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [PM2 Documentation](https://pm2.keymetrics.io/docs/usage/quick-start/)
- [Hostinger Support](https://www.hostinger.com/tutorials)
- [Project Repository](https://github.com/Ahnabu/evo-tech)
