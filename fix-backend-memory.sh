#!/bin/bash
# Quick Fix for Backend Crashing Issue on Hostinger
# Run after SSH: ssh -p 65002 u379849097@46.202.161.130

echo "🔧 Applying Backend Memory Fix..."
echo "================================"

# Activate Node environment
source ~/.nvm/nvm.sh
export PATH="$HOME/.nvm/versions/node/v20.19.6/bin:$PATH"

# Backup current config
cd ~/domains/evo-techbd.com/public_html/evobackend
cp ecosystem.config.js ecosystem.config.js.backup

# Update PM2 config with better memory and restart settings
cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [
    {
      name: "evo-tech-backend",
      script: "./dist/server.js",
      cwd: "/home/u379849097/domains/evo-techbd.com/public_html/evobackend",
      instances: 1,
      exec_mode: "cluster",
      autorestart: true,
      watch: false,
      max_memory_restart: "1G",
      min_uptime: "10s",
      max_restarts: 10,
      restart_delay: 4000,
      exp_backoff_restart_delay: 100,
      kill_timeout: 5000,
      listen_timeout: 10000,
      env: {
        NODE_ENV: "production",
        PORT: 5000,
        MONGODB_URI: "mongodb+srv://evotechbd22:FOJ6Gw1QB07zdsvT@cluster0.yapaiux.mongodb.net/?appName=Cluster0",
        JWT_ACCESS_SECRET: "13242af6503ed5d1e158620ebf0e3432331fe356ea4879af1658893541e0ec67",
        JWT_REFRESH_SECRET: "cb7083cc7f51564a4fe4931a44ecc81f2e8a36e93af9c0126617336f1aa95ade",
        JWT_REFRESH_EXPIRES_IN: "30d",
        BCRYPT_SALT_ROUNDS: "12",
        ADMIN_EMAIL: "admin@evotech.com",
        ADMIN_PASSWORD: "admin123",
        ADMIN_FIRSTNAME: "Admin",
        ADMIN_LASTNAME: "User",
        ADMIN_PHONE: "+1234567890",
        CLOUDINARY_CLOUD_NAME: "evo-tech",
        CLOUDINARY_API_KEY: "931291684898585",
        CLOUDINARY_API_SECRET: "ahnQeDoLp8cTmpVXKbHkg5Mp8W0",
        CORS_ORIGIN: "https://evo-techbd.com",
        FRONTEND_URL: "https://evo-techbd.com",
        BKASH_BASE_URL: "https://tokenized.pay.bka.sh/v1.2.0-beta",
        BKASH_APP_KEY: "your-production-bkash-app-key",
        BKASH_APP_SECRET: "your-production-bkash-app-secret",
        BKASH_USERNAME: "your-production-bkash-username",
        BKASH_PASSWORD: "your-production-bkash-password"
      },
      error_file: "./logs/error.log",
      out_file: "./logs/out.log",
      merge_logs: true,
      log_date_format: "YYYY-MM-DD HH:mm:ss Z"
    }
  ]
};
EOF

echo "✅ Config updated with:"
echo "   - Memory limit: 500M → 1G"
echo "   - Added min_uptime: 10s"
echo "   - Added max_restarts: 10"
echo "   - Added restart_delay: 4000ms"
echo "   - Added backoff restart delay"
echo ""

# Restart backend with new config
echo "🔄 Restarting backend with new configuration..."
pm2 delete evo-tech-backend 2>/dev/null || true
pm2 start ecosystem.config.js --update-env
pm2 save

echo ""
echo "✅ Backend restarted!"
echo ""

# Show status
echo "📊 Current Status:"
pm2 list

echo ""
echo "📝 Monitoring logs for 10 seconds..."
pm2 logs evo-tech-backend --lines 20 --nostream

echo ""
echo "================================"
echo "✅ FIX APPLIED!"
echo "================================"
echo ""
echo "Next steps:"
echo "1. Monitor: pm2 logs evo-tech-backend"
echo "2. Test: Visit https://evo-techbd.com"
echo "3. If still crashing, check: pm2 describe evo-tech-backend"
echo ""
echo "To restore old config if needed:"
echo "  cp ecosystem.config.js.backup ecosystem.config.js"
echo "  pm2 restart evo-tech-backend"
echo ""
