# Vercel Deployment Guide for Evo-Tech Frontend

## Project Structure
This is a monorepo with the Next.js frontend in the `frontend/` subdirectory.

## Automatic Deployment Configuration

The root `vercel.json` is configured to:
- Install dependencies from `frontend/` directory
- Build the Next.js app from `frontend/` directory
- Output to `frontend/.next`

## Required Environment Variables in Vercel Dashboard

Set these in your Vercel Project Settings → Environment Variables:

### Required for All Environments (Production, Preview, Development)

```env
# Backend API
NEXT_PUBLIC_BACKEND_URL=https://your-backend-api.com/api/v1
NEXT_PUBLIC_API_URL=https://your-backend-api.com/api/v1

# Frontend URL (will auto-populate with Vercel URL if not set)
NEXT_PUBLIC_FEND_URL=https://your-vercel-app.vercel.app

# Authentication
NEXTAUTH_URL=https://your-vercel-app.vercel.app
NEXTAUTH_SECRET=<generate-a-strong-random-secret>
AUTH_SECRET=<same-as-nextauth-secret>

# Environment
NODE_ENV=production
```

## Generating Secrets

Generate strong random secrets for production:

```bash
# On Linux/Mac/WSL
openssl rand -base64 32

# Or use Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

## Vercel Project Settings

1. **Framework Preset**: Next.js (auto-detected)
2. **Root Directory**: Leave as `.` (root) - the vercel.json handles the subdirectory
3. **Build Command**: `cd frontend && npm run build` (configured in vercel.json)
4. **Install Command**: `cd frontend && npm install` (configured in vercel.json)
5. **Output Directory**: `frontend/.next` (configured in vercel.json)

## Common Issues & Solutions

### Issue: "ENOENT: no such file or directory, lstat '.next/server/app/(users)/page_client-reference-manifest.js'"

**Solution**: Already fixed with:
- `dynamic = "force-dynamic"` in `app/(users)/page.tsx`
- `runtime = "nodejs"` in `auth.config.ts` and `auth.ts`
- Experimental server actions config in `next.config.mjs`

### Issue: Environment variables not working

**Solution**: 
- Make sure variables are set in Vercel dashboard, not just in `.env` files
- Redeploy after adding new environment variables
- Use `NEXT_PUBLIC_` prefix for client-side variables

### Issue: Build succeeds but runtime errors

**Solution**:
- Check Vercel Function Logs in the dashboard
- Verify `NEXT_PUBLIC_BACKEND_URL` is accessible from Vercel's network
- Ensure `NEXTAUTH_URL` matches your actual deployed URL

## Deployment Steps

1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Configure Vercel deployment"
   git push origin main
   ```

2. **Connect to Vercel**:
   - Go to vercel.com
   - Import your GitHub repository
   - Vercel will auto-detect Next.js

3. **Configure Environment Variables**:
   - In Vercel Dashboard → Settings → Environment Variables
   - Add all variables listed above
   - Make sure to set for Production, Preview, and Development

4. **Deploy**:
   - Click "Deploy"
   - Vercel will run the build command from `vercel.json`
   - First build might take 2-3 minutes

## Post-Deployment Checklist

- [ ] Home page loads without errors
- [ ] Login/authentication works
- [ ] API calls to backend succeed
- [ ] Static assets (images) load correctly
- [ ] Admin/protected routes work as expected
- [ ] Check Vercel Function Logs for any runtime errors

## Troubleshooting Build Failures

If build fails on Vercel:

1. Check the build logs in Vercel dashboard
2. Verify all environment variables are set
3. Try building locally first: `cd frontend && npm run build`
4. Check that `package.json` has all dependencies (not just devDependencies)
5. Ensure Next.js version compatibility (currently using 15.5.5)

## Updating Deployment

Push changes to your GitHub repository:
```bash
git push origin main
```

Vercel will automatically rebuild and deploy on every push to `main` branch.

## Production Best Practices

1. **Use separate backends for preview/production**:
   - Set different `NEXT_PUBLIC_BACKEND_URL` for Preview vs Production
   - This prevents preview deployments from affecting production data

2. **Monitor performance**:
   - Use Vercel Analytics
   - Check Core Web Vitals in Vercel dashboard

3. **Set up custom domain**:
   - In Vercel Dashboard → Settings → Domains
   - Update `NEXTAUTH_URL` to match custom domain

## Support

If issues persist:
- Check Next.js 15 migration guide
- Review Vercel deployment documentation
- Check GitHub Issues for similar problems
