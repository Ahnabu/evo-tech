module.exports = {
  apps: [
    {
      name: "evo-tech-backend",
      script: "./dist/server.js",
      cwd: "/home/u379849097/domains/evo-techbd.com/public_html/evobackendabc",
      instances: 1,
      exec_mode: "fork",
      autorestart: true,
      watch: false,
      max_memory_restart: "500M",
      min_uptime: "10s",
      max_restarts: 10,
      restart_delay: 4000,
      exp_backoff_restart_delay: 100,
      kill_timeout: 5000,
      listen_timeout: 10000,
      error_file: "./logs/pm2-error.log",
      out_file: "./logs/pm2-out.log",
      merge_logs: true,
      log_date_format: "YYYY-MM-DD HH:mm:ss Z",
      env: {
        NODE_ENV: "production",
        PORT: 5000,
      },
    },
  ],
};
