module.exports = {
  apps: [
    {
      name: "STRAPI_CMS",
      script: "yarn cms:prod",
      instances: 1,
      autorestart: true,
      watch: true,
      max_memory_restart: "1G",
      env: {
        NODE_ENV: "production",
        DATABASE_NAME: "silvergenieCMSProd",
        PORT: 3000,
      },
      env_staging: {
        NODE_ENV: "staging",
        DATABASE_NAME: "silvergenieCMSStaging",
        PORT: 4000,
      },
      error_file: "/home/ubuntu/logs/CMS/error.txt",
      out_file: "/home/ubuntu/logs/CMS/log.txt",
    },
    {
      name: "WEBAPP_FORMS",
      script: "yarn form:prod",
      instances: 1,
      autorestart: true,
      watch: true,
      max_memory_restart: "1G",
      env: {
        NODE_ENV: "production",
      },
      error_file: "/home/ubuntu/logs/FORM/error.txt",
      out_file: "/home/ubuntu/logs/FORM/log.txt",
    },
  ],
};
