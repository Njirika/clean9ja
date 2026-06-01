module.exports = {
  apps: [
    {
      name: 'clean9ja-api',
      script: 'npm',
      args: 'start',
      instances: 'max', // Scale across all available CPU cores
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 5000,
      },
      log_date_format: 'YYYY-MM-DD HH:mm Z',
      error_file: 'logs/pm2-error.log',
      out_file: 'logs/pm2-out.log',
      merge_logs: true,
      max_restarts: 10,
      restart_delay: 4000,
    },
  ],
};
