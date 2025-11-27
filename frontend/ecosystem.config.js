// PM2 Configuration for Hostinger deployment
const path = require('path');
const fs = require('fs');

// Check if standalone build exists
const standaloneServer = path.join(__dirname, '.next/standalone/server.js');
const hasStandalone = fs.existsSync(standaloneServer);

module.exports = {
  apps: [
    {
      name: 'evo-tech-frontend',
      // Use standalone server if available, otherwise use next start
      script: hasStandalone ? '.next/standalone/server.js' : 'node_modules/next/dist/bin/next',
      args: hasStandalone ? '' : 'start',
      cwd: './',
      instances: 1,
      exec_mode: 'cluster',
      watch: false,
      max_memory_restart: '500M',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
        HOSTNAME: '0.0.0.0',
      },
      error_file: './logs/pm2-error.log',
      out_file: './logs/pm2-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      // Auto-restart on crash
      autorestart: true,
      // Wait before restarting after crash
      restart_delay: 4000,
      // Max number of restarts within min_uptime
      max_restarts: 10,
      // Min uptime to not be considered errored restart
      min_uptime: '10s',
    },
  ],
};
