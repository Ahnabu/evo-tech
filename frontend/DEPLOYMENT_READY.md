# Hostinger Deployment - Ready! 🚀

Your frontend is now **ready for Hostinger deployment**! All necessary configurations and scripts have been added.

## What's Been Added

### 1. **Dependencies**
- ✅ `sharp` - For production image optimization
- ✅ `pm2` - For process management (dev dependency)

### 2. **Scripts**
- ✅ `npm run build:hostinger` - Build with standalone output
- ✅ `npm run deploy:hostinger` - Build and restart with PM2
- ✅ `npm run pm2:start` - Start app with PM2
- ✅ `npm run pm2:stop` - Stop app with PM2
- ✅ `npm run pm2:restart` - Restart app with PM2
- ✅ `npm run pm2:logs` - View PM2 logs

### 3. **Configuration Files**
- ✅ `ecosystem.config.js` - PM2 process management (enhanced)
- ✅ `.htaccess` - Apache reverse proxy configuration
- ✅ `.env.production.example` - Production environment template
- ✅ `next.config.mjs` - Standalone build support

### 4. **Deployment Scripts**
- ✅ `deploy.sh` - Automated deployment script
- ✅ `post-build.sh` - Post-build preparation for standalone

### 5. **Documentation**
- ✅ `HOSTINGER_DEPLOYMENT.md` - Detailed deployment guide
- ✅ `QUICK_START.md` - Quick reference guide
- ✅ `DEPLOYMENT_CHECKLIST.md` - Pre-deployment checklist
- ✅ `DEPLOYMENT_READY.md` - This file

### 6. **Infrastructure**
- ✅ `/logs` - Directory for PM2 logs
- ✅ `/api/health` - Health check endpoint

## Quick Deployment (3 Commands)

On your Hostinger server:

```bash
# 1. Upload/clone your code
git clone https://github.com/Ahnabu/evo-tech.git
cd evo-tech/frontend

# 2. Create environment file
cp .env.production.example .env.production
nano .env.production  # Edit with your values

# 3. Deploy
chmod +x deploy.sh
./deploy.sh
```

That's it! Your app will be running.

## Environment Variables Required

Before deploying, create `.env.production` with these values:

```env
NEXT_PUBLIC_BACKEND_URL=https://api.evo-techbd.com/api/v1
NEXT_PUBLIC_API_URL=https://api.evo-techbd.com/api/v1
NEXT_PUBLIC_FEND_URL=https://yourdomain.com
NEXTAUTH_SECRET=<generate-with-openssl-rand-base64-32>
AUTH_SECRET=<same-as-above>
NEXTAUTH_URL=https://yourdomain.com
NODE_ENV=production
PORT=3000
BUILD_STANDALONE=true
```

Generate secrets with:
```bash
openssl rand -base64 32
```

## Verify Deployment

After deployment, check:

1. **PM2 Status:**
   ```bash
   pm2 status
   ```

2. **Application Health:**
   ```bash
   curl http://localhost:3000/api/health
   ```

3. **View Logs:**
   ```bash
   pm2 logs evo-tech-frontend
   ```

4. **Visit Your Site:**
   - Open your domain in browser
   - Check all functionality

## Common Issues & Solutions

### Issue: Port Already in Use
```bash
lsof -i :3000
kill -9 <PID>
pm2 restart evo-tech-frontend
```

### Issue: Build Fails
```bash
rm -rf .next node_modules package-lock.json
npm install
npm run build:hostinger
```

### Issue: Images Not Loading
- Check `next.config.mjs` remote patterns
- Ensure Sharp is installed: `npm install sharp`

### Issue: 502 Bad Gateway
- Check PM2 status: `pm2 status`
- Check logs: `pm2 logs evo-tech-frontend`
- Verify port in ecosystem.config.js matches Apache config

## Next Steps

1. **Configure Apache** - Set up virtual host and reverse proxy
2. **Install SSL** - Use Let's Encrypt: `certbot --apache`
3. **Setup Monitoring** - Configure uptime monitoring
4. **Configure Backups** - Implement backup strategy

## Useful Commands

```bash
# Update application
cd ~/evo-tech/frontend
./deploy.sh

# View live logs
pm2 logs evo-tech-frontend --lines 100

# Restart app
pm2 restart evo-tech-frontend

# Stop app
pm2 stop evo-tech-frontend

# Monitor resources
pm2 monit
```

## Documentation

- **Detailed Guide:** `HOSTINGER_DEPLOYMENT.md`
- **Quick Reference:** `QUICK_START.md`
- **Checklist:** `DEPLOYMENT_CHECKLIST.md`

## Support

If you encounter issues:
1. Check the documentation files listed above
2. Review PM2 logs: `pm2 logs evo-tech-frontend`
3. Check system resources: `pm2 monit`
4. Contact Hostinger support for server-specific issues

---

**Status:** ✅ Ready for Deployment
**Version:** 1.1.0
**Last Updated:** November 25, 2025
