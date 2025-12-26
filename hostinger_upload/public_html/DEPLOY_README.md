# Evo-Tech Backend Deployment Guide (Manual)

Since the SSH connection is blocked, you need to deploy manually using the Hostinger File Manager.

## 1. Upload
1. Log in to Hostinger hPanel > Websites > Manage > **File Manager**.
2. Navigate to `public_html` folder.
3. Upload `deploy_package.zip` from your computer (located in `c:\Projects\JobTask\evo-tech\hostinger_upload\`).
4. Right-click the zip file and choose **Extract**. 
   - Extract it directly into `public_html`.
   - Ensure you see:
     - `public_html/evobackend/` (folder)
     - `public_html/.htaccess` (file)

## 2. Start Backend
1. In Hostinger, go to **Advanced** > **SSH Access**.
2. If the "Terminal" or "Web SSH" is available, open it.
3. Run these commands:
   ```bash
   cd domains/evo-techbd.com/public_html/evobackend
   pm2 start ecosystem.config.js --update-env
   pm2 save
   ```

## 3. Troubleshooting
- If you can't access SSH at all (even web terminal), you might need to use **Node.js Selector** in hPanel (if available) to start the app, or contact Hostinger support to unblock port 65002.
- Check logs: `cat logs/out.log` or `cat logs/error.log` inside `evobackend` folder.
