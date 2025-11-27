# Hostinger Deployment Checklist

## Pre-Deployment ✅

### Code Preparation
- [ ] All code committed to Git
- [ ] No console.log or debug statements in production code
- [ ] Environment variables documented in `.env.production.example`
- [ ] Build runs successfully locally with `npm run build:hostinger`

### Dependencies
- [ ] `sharp` installed for image optimization
- [ ] `pm2` available for process management
- [ ] All required packages in `package.json`
- [ ] No outdated or vulnerable dependencies (`npm audit`)

### Configuration Files
- [ ] `next.config.mjs` configured with standalone output
- [ ] `ecosystem.config.js` configured for PM2
- [ ] `.htaccess` file ready for Apache
- [ ] `.gitignore` excludes sensitive files

## Server Setup ✅

### System Requirements
- [ ] Node.js 18+ installed on server
- [ ] PM2 installed globally (`npm install -g pm2`)
- [ ] Git installed (if using Git deployment)
- [ ] Sufficient disk space (minimum 2GB free)
- [ ] Sufficient RAM (minimum 1GB available)

### Access & Permissions
- [ ] SSH access configured
- [ ] Correct file permissions (755 for directories, 644 for files)
- [ ] User has necessary permissions to run Node.js and PM2

### Network Configuration
- [ ] Domain DNS configured and pointing to server
- [ ] Firewall allows HTTP (80) and HTTPS (443)
- [ ] Port 3000 accessible (or configured port)

## Environment Configuration ✅

### Environment Variables (.env.production)
- [ ] `NEXT_PUBLIC_BACKEND_URL` set to production API
- [ ] `NEXT_PUBLIC_API_URL` set to production API
- [ ] `NEXT_PUBLIC_FEND_URL` set to production domain
- [ ] `NEXTAUTH_SECRET` generated securely (openssl rand -base64 32)
- [ ] `AUTH_SECRET` set (same as NEXTAUTH_SECRET)
- [ ] `NEXTAUTH_URL` set to production domain
- [ ] `NODE_ENV=production`
- [ ] `PORT=3000` (or your chosen port)
- [ ] `BUILD_STANDALONE=true`

### Backend Configuration
- [ ] Backend API is accessible from server
- [ ] CORS configured on backend to allow frontend domain
- [ ] Backend health endpoint responding
- [ ] Database connection working from backend

## Deployment Process ✅

### Upload Code
- [ ] Code uploaded to server (Git clone or rsync)
- [ ] All files transferred successfully
- [ ] `.env.production` created on server

### Build & Start
- [ ] Dependencies installed (`npm install`)
- [ ] Build completed successfully (`npm run build:hostinger`)
- [ ] Application started with PM2 (`pm2 start ecosystem.config.js`)
- [ ] PM2 process saved (`pm2 save`)
- [ ] PM2 startup configured (`pm2 startup`)

### Web Server Configuration
- [ ] Apache/Nginx configured as reverse proxy
- [ ] Proxy passes requests to Node.js port
- [ ] Static files served correctly
- [ ] Gzip compression enabled
- [ ] SSL certificate installed and configured
- [ ] HTTP redirects to HTTPS

## Post-Deployment Verification ✅

### Functionality Tests
- [ ] Home page loads correctly
- [ ] User registration works
- [ ] User login works
- [ ] Product listing displays
- [ ] Product details page works
- [ ] Shopping cart functions
- [ ] Checkout process completes
- [ ] Admin panel accessible
- [ ] API endpoints responding

### Performance Tests
- [ ] Page load time acceptable (<3 seconds)
- [ ] Images loading and optimized
- [ ] No console errors in browser
- [ ] Mobile responsiveness working
- [ ] SEO meta tags present

### Security Tests
- [ ] HTTPS enforced
- [ ] Security headers configured
- [ ] No sensitive data exposed in client
- [ ] Authentication working correctly
- [ ] Authorization checks in place
- [ ] CSRF protection enabled

### Monitoring Setup
- [ ] Health check endpoint responding (`/api/health`)
- [ ] PM2 monitoring active
- [ ] Log rotation configured
- [ ] Error tracking setup (optional: Sentry, etc.)
- [ ] Uptime monitoring (optional: UptimeRobot, etc.)

## Rollback Plan ✅

### Backup Strategy
- [ ] Previous working version tagged in Git
- [ ] Database backup created (if applicable)
- [ ] PM2 previous process list saved

### Rollback Commands
```bash
# Quick rollback commands
git checkout <previous-tag>
npm install
npm run build:hostinger
pm2 restart evo-tech-frontend
```

## Maintenance Schedule ✅

### Regular Tasks
- [ ] Weekly: Review PM2 logs for errors
- [ ] Weekly: Check disk space usage
- [ ] Monthly: Update dependencies
- [ ] Monthly: Review and rotate logs
- [ ] Quarterly: Security audit
- [ ] Quarterly: Performance optimization review

## Emergency Contacts ✅

- **Hosting Support:** Hostinger Support Portal
- **DNS Provider:** [Your DNS Provider]
- **SSL Certificate:** [Let's Encrypt or Provider]
- **Development Team:** [Contact Information]

## Documentation ✅

- [ ] `HOSTINGER_DEPLOYMENT.md` - Detailed deployment guide
- [ ] `QUICK_START.md` - Quick reference guide
- [ ] `README.md` - Project overview updated
- [ ] API documentation accessible
- [ ] Admin manual available

## Final Sign-Off ✅

- [ ] All checklist items completed
- [ ] Deployment tested by QA/team
- [ ] Stakeholders notified
- [ ] Documentation updated
- [ ] Deployment date/time logged

---

**Deployment Date:** _______________
**Deployed By:** _______________
**Version:** 1.1.0
**Notes:** _______________
