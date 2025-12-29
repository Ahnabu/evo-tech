HOSTINGER DEPLOYMENT INSTRUCTIONS

Files are ready in hostinger_upload folder!

STEPS:
1. Upload all files from hostinger_upload to your Hostinger public_html
2. Create .env files (see .env.example in both root and evobackend)
3. SSH into Hostinger and run: npm install --production (in both folders)
4. Start services with PM2: pm2 start ecosystem.config.js

Structure:
public_html/
  .next/                  (frontend build)
  public/                 (frontend static)
  evobackend/            (backend folder)
    dist/                (compiled backend)
    public/              (backend static)
    logs/
  package.json
  ecosystem.config.js
  .htaccess
