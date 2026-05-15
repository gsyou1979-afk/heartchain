module.exports = {
  apps: [
    {
      name: 'heartchain-backend',
      cwd: 'E:\\WorkBuddy\\heartchain\\backend',
      script: 'node',
      args: 'dist/main.js',
      env: {
        NODE_ENV: 'development',
        PORT: 3002,
      },
      // 자동 재시작
      autorestart: true,
      watch: false,
      max_memory_restart: '500M',
      // 로그
      out_file: 'E:\\WorkBuddy\\heartchain\\backend\\logs\\out.log',
      error_file: 'E:\\WorkBuddy\\heartchain\\backend\\logs\\err.log',
      merge_logs: true,
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
    },
    {
      name: 'heartchain-frontend',
      cwd: 'E:\\WorkBuddy\\heartchain\\web',
      script: 'node',
      args: '.output/server/index.mjs',
      env: {
        NODE_ENV: 'production',
        PORT: 3001,
        NITRO_PORT: 3001,
        NUXT_PUBLIC_API_BASE: 'http://localhost:3002/api/v1',
      },
      autorestart: true,
      watch: false,
      max_memory_restart: '500M',
      out_file: 'E:\\WorkBuddy\\heartchain\\web\\logs\\out.log',
      error_file: 'E:\\WorkBuddy\\heartchain\\web\\logs\\err.log',
      merge_logs: true,
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
    },
  ],
};
