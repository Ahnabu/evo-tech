# Evo-Tech Project Structure

This repository contains the **backend** and **server management scripts** for the Evo-Tech project.

## Repository Structure

This project is split into two separate GitHub repositories:

### 1. Root Repository (This Repo)
**Repository:** https://github.com/Ahnabu/evo-tech.git

**Contains:**
- `backend/` - Express.js API server
- Deployment scripts for Hostinger
- PM2 configuration files
- Server management scripts
- Documentation

**Key Files:**
- `start-servers.sh` - Start both backend and frontend
- `prepare_upload.sh` - Prepare files for Hostinger deployment
- `DEPLOYMENT_GUIDE.md` - Hostinger deployment instructions
- `README.md` - This file

### 2. Frontend Repository (Separate)
**Repository:** https://github.com/evo-techbd/evo-tech-frontend.git

**Contains:**
- Next.js frontend application
- Deployed on Vercel
- Custom domain: https://evo-techbd.com

**Note:** The `frontend/` folder is excluded from this repository (see `.gitignore`)

## Getting Started

### Clone Both Repositories

```bash
# Clone root repository
git clone https://github.com/Ahnabu/evo-tech.git
cd evo-tech

# Clone frontend repository
git clone https://github.com/evo-techbd/evo-tech-frontend.git frontend
```

### Setup

#### Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Configure your .env file
npm run dev
```

#### Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env.local
# Configure your .env.local file
npm run dev
```

## Deployment

### Backend (Hostinger)
See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for Hostinger deployment instructions.

### Frontend (Vercel)
The frontend is automatically deployed to Vercel when pushing to the frontend repository.
- Production URL: https://evo-techbd.com
- See frontend repo for deployment details

## Scripts

### Hostinger Deployment
- `prepare_upload.sh` - Prepare backend for upload
- `deploy-backend-fix.sh` - Deploy backend fixes
- `full-restart-hostinger.sh` - Complete server restart

### PM2 Management
- `pm2-keepalive.sh` - Ensure PM2 processes stay running
- `pm2-503-prevention.sh` - Prevent 503 errors

### Diagnostics
- `diagnose-backend.sh` - Backend diagnostics
- `diagnose-and-fix-hostinger.sh` - Full system diagnostics
- `check-logs-comprehensive.sh` - Comprehensive log checking

## Environment Variables

### Backend (.env)
See `backend/.env.example` for required variables

### Frontend (.env.local)
See `frontend/.env.example` in the frontend repository

## Development Workflow

### Working on Backend
```bash
cd backend
git add .
git commit -m "Your message"
git push origin main
```

### Working on Frontend
```bash
cd frontend
git add .
git commit -m "Your message"
git push origin main
```

Both repositories are independent and can be developed separately.

## Production URLs

- **Frontend:** https://evo-techbd.com (Vercel)
- **Backend API:** https://api.evo-techbd.com/api/v1 (Hostinger)

## Tech Stack

### Backend
- Node.js + Express
- MongoDB
- TypeScript
- JWT Authentication

### Frontend
- Next.js 15
- React
- TypeScript
- Tailwind CSS
- NextAuth.js

## Support

For issues:
- Backend issues: Report in this repository
- Frontend issues: Report in [frontend repository](https://github.com/evo-techbd/evo-tech-frontend/issues)

## License

Private - All rights reserved
