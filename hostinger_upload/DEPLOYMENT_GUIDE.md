# Hostinger Deployment Guide for Evo-Tech

## 📁 File Structure

Your `hostinger_upload` folder contains:

```
hostinger_upload/
├── .next/                  # Frontend build files
├── public/                 # Frontend static assets
├── evobackend/            # Backend application folder
│   ├── dist/              # Compiled TypeScript to JavaScript
│   ├── public/            # Backend uploads/static files
│   ├── logs/              # Application logs
│   ├── package.json       # Backend dependencies
│   └── .env.example       # Backend environment template
├── package.json           # Frontend dependencies
├── ecosystem.config.js    # PM2 configuration for frontend
├── next.config.mjs        # Next.js configuration
├── .htaccess              # Apache routing configuration
└── .env.example           # Frontend environment template
```

## 🚀 Deployment Steps

### 1. Upload Files to Hostinger

Upload the entire contents of `hostinger_upload` folder to your Hostinger `public_html` directory:

- Use Hostinger File Manager, or
- Use FTP/SFTP client (FileZilla, WinSCP, etc.)
- SSH command: `scp -r hostinger_upload/* user@yourserver:~/public_html/`

### 2. Create Environment Files

#### Frontend (.env in root of public_html)

Create `.env` file in `public_html/` with:

```env
# Backend API Configuration
NEXT_PUBLIC_BACKEND_URL=https://yourdomain.com/api/v1
NEXT_PUBLIC_API_URL=https://yourdomain.com/api/v1
NEXT_PUBLIC_FEND_URL=https://yourdomain.com

# NextAuth Configuration
NEXTAUTH_SECRET=your-secure-random-secret-here-min-32-chars
AUTH_SECRET=your-secure-random-secret-here-min-32-chars
NEXTAUTH_URL=https://yourdomain.com

# App Configuration
NODE_ENV=production
```

**Generate secure secrets:**

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

#### Backend (.env in public_html/evobackend/)

Create `.env` file in `public_html/evobackend/` with:

```env
# Environment
NODE_ENV=production
PORT=5000

# Database
DATABASE_URL=mongodb+srv://username:password@cluster.mongodb.net/dbname?retryWrites=true&w=majority

# JWT Configuration
JWT_ACCESS_SECRET=your-jwt-access-secret-here
JWT_ACCESS_EXPIRES_IN=8h
JWT_REFRESH_SECRET=your-jwt-refresh-secret-here
JWT_REFRESH_EXPIRES_IN=30d

# CORS
CORS_ORIGIN=https://yourdomain.com

# Cloudinary (for image uploads)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Email Configuration (if using email features)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password

# Other configurations
BCRYPT_SALT_ROUNDS=12
```

### 3. Install Dependencies via SSH

SSH into your Hostinger account:

```bash
ssh your-username@your-server-ip
```

#### Install Frontend Dependencies:

```bash
cd ~/public_html
npm install --production
```

#### Install Backend Dependencies:

```bash
cd ~/public_html/evobackend
npm install --production
```

### 4. Configure .htaccess

Verify the `.htaccess` file in your `public_html` root is correct. It should proxy requests to your Node.js applications.

**Important Routes:**

- `/api/v1/*` → Backend (port 5000)
- All other routes → Frontend (port 3000)

### 5. Start Applications with PM2

#### Start Backend:

```bash
cd ~/public_html/evobackend
pm2 start ecosystem.config.js
```

#### Start Frontend:

```bash
cd ~/public_html
pm2 start ecosystem.config.js
```

#### Save PM2 Configuration:

```bash
pm2 save
pm2 startup
# Follow the instructions provided by PM2
```

### 6. Verify Deployment

- **Frontend**: https://yourdomain.com
- **Backend API**: https://yourdomain.com/api/v1
- **Health Check**: https://yourdomain.com/api/health

## 🔧 PM2 Management Commands

```bash
# List all processes
pm2 list

# View logs
pm2 logs

# View specific app logs
pm2 logs evo-tech-frontend
pm2 logs evo-tech-backend

# Restart applications
pm2 restart all
pm2 restart evo-tech-frontend
pm2 restart evo-tech-backend

# Stop applications
pm2 stop all
pm2 stop evo-tech-frontend
pm2 stop evo-tech-backend

# Delete from PM2
pm2 delete all
pm2 delete evo-tech-frontend
pm2 delete evo-tech-backend

# Monitor resources
pm2 monit
```

## 🔄 Update/Redeploy

When you need to update your application:

```bash
# Stop services
pm2 stop all

# Upload new files (overwrite old ones)
# Update via File Manager or FTP

# Restart services
pm2 restart all
```

## 🐛 Troubleshooting

### Application not starting:

```bash
# Check PM2 logs
pm2 logs

# Check if ports are in use
lsof -i :3000
lsof -i :5000

# Kill processes if needed
kill -9 <PID>
```

### Database connection issues:

- Verify MongoDB connection string
- Check if MongoDB Atlas allows connections from your Hostinger IP
- Add Hostinger IP to MongoDB Atlas whitelist

### 502 Bad Gateway:

- Ensure PM2 processes are running: `pm2 list`
- Check if `.htaccess` ProxyPass is configured correctly
- Verify ports 3000 and 5000 are not blocked

### Environment variables not loading:

- Ensure `.env` files are in correct locations
- Check file permissions: `chmod 600 .env`
- Restart PM2 after env changes: `pm2 restart all`

## 📊 Monitoring

Set up monitoring for production:

```bash
# Enable PM2 monitoring
pm2 install pm2-logrotate

# Configure log rotation
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7
```

## 🔒 Security Checklist

- ✅ Strong secrets for JWT and NextAuth
- ✅ CORS properly configured
- ✅ Environment files have correct permissions (600)
- ✅ Database uses strong password
- ✅ MongoDB whitelists only necessary IPs
- ✅ SSL certificate installed (HTTPS)
- ✅ Regular backups enabled
- ✅ PM2 logs monitored regularly

## 📞 Support

For issues:

1. Check PM2 logs: `pm2 logs`
2. Review error messages in browser console
3. Verify all environment variables are set
4. Ensure MongoDB connection is active

---

**Deployment Date:** $(date)
**Built With:** Node.js, Next.js 15, Express, MongoDB
