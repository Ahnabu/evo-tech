# Hostinger Deployment Guide for Evo-Tech Frontend

## Prerequisites
- Hostinger VPS or Cloud Hosting plan (Node.js hosting)
- Node.js 18+ installed on the server
- PM2 process manager
- SSH access to your Hostinger server

## Deployment Steps

### 1. Prepare Your Local Project

Build the project with standalone output:
```bash
cd frontend
BUILD_STANDALONE=true npm run build
```

### 2. Connect to Your Hostinger Server via SSH

```bash
ssh your-username@your-server-ip
```

### 3. Install Node.js and PM2 (if not already installed)

```bash
# Install Node.js (if needed)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 globally
sudo npm install -g pm2
```

### 4. Upload Your Project

You can use Git, FTP, or rsync. Here's the Git method:

```bash
# On your server
cd /home/your-username/
git clone https://github.com/Ahnabu/evo-tech.git
cd evo-tech/frontend
```

Or use rsync from local:
```bash
# From your local machine
rsync -avz --exclude 'node_modules' --exclude '.next' ./frontend/ your-username@your-server-ip:/home/your-username/evo-tech/frontend/
```

### 5. Set Up Environment Variables on Server

Create a `.env.production` file:
```bash
nano .env.production
```

Add your production environment variables:
```env
# Backend API Configuration
NEXT_PUBLIC_BACKEND_URL=https://api.evo-techbd.com/api/v1
NEXT_PUBLIC_API_URL=https://api.evo-techbd.com/api/v1
NEXT_PUBLIC_FEND_URL=https://yourdomain.com

# NextAuth Configuration
NEXTAUTH_SECRET=your-super-secure-secret-here
AUTH_SECRET=your-super-secure-secret-here
NEXTAUTH_URL=https://yourdomain.com

# App Configuration
NODE_ENV=production
PORT=3000

# Optional: Enable standalone build
BUILD_STANDALONE=true
```

### 6. Install Dependencies and Build

```bash
npm install --production
BUILD_STANDALONE=true npm run build
```

### 7. Start the Application with PM2

```bash
# Start the app
pm2 start ecosystem.config.js

# Save PM2 process list
pm2 save

# Set PM2 to start on system boot
pm2 startup

# Check status
pm2 status
pm2 logs evo-tech-frontend
```

### 8. Configure Nginx or Apache (Hostinger typically uses Apache)

Create or edit Apache virtual host configuration:

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

Enable required Apache modules:
```bash
sudo a2enmod proxy
sudo a2enmod proxy_http
sudo a2enmod rewrite
sudo systemctl restart apache2
```

### 9. Set Up SSL Certificate (Recommended)

```bash
# Install Certbot
sudo apt install certbot python3-certbot-apache

# Get SSL certificate
sudo certbot --apache -d yourdomain.com -d www.yourdomain.com
```

### 10. Verify Deployment

Visit your domain and check if the application is running correctly.

## Useful PM2 Commands

```bash
# View logs
pm2 logs evo-tech-frontend

# Restart the app
pm2 restart evo-tech-frontend

# Stop the app
pm2 stop evo-tech-frontend

# Delete from PM2
pm2 delete evo-tech-frontend

# Monitor
pm2 monit
```

## Updating Your Application

```bash
# Pull latest changes
cd /home/your-username/evo-tech/frontend
git pull origin main

# Install new dependencies (if any)
npm install --production

# Rebuild
BUILD_STANDALONE=true npm run build

# Restart with PM2
pm2 restart evo-tech-frontend
```

## Troubleshooting

### Port Already in Use
```bash
# Find process using port 3000
lsof -i :3000
# Kill the process
kill -9 <PID>
```

### Memory Issues
- Adjust `max_memory_restart` in `ecosystem.config.js`
- Consider upgrading your hosting plan

### Image Optimization Issues
- Make sure Sharp is installed: `npm install sharp`
- Check image domain permissions in `next.config.mjs`

### Environment Variables Not Loading
- Ensure `.env.production` is in the correct directory
- Restart PM2: `pm2 restart evo-tech-frontend`

## Alternative: Docker Deployment (Advanced)

If Hostinger supports Docker:

1. Build Docker image:
```bash
docker build -t evo-tech-frontend .
```

2. Run container:
```bash
docker run -d -p 3000:3000 --env-file .env.production evo-tech-frontend
```

## Notes

- **Standalone Build**: The `BUILD_STANDALONE=true` flag creates a self-contained build that includes all necessary dependencies
- **Port Configuration**: Default is 3000, but you can change it in ecosystem.config.js and your environment variables
- **Static Assets**: Next.js will handle static file serving automatically
- **Database Connections**: Make sure your backend API is accessible from Hostinger's network

## Support

For Hostinger-specific issues, contact their support or check their documentation:
- https://www.hostinger.com/tutorials/how-to-deploy-nodejs-app
