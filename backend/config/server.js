module.exports = {
  // Server configuration
  host: process.env.HOST || '0.0.0.0',
  port: process.env.PORT || 1337,
  app: {
    keys: process.env.APP_KEYS || 'crum-blog-app-keys',
  },

  // Admin configuration
  admin: {
    url: process.env.ADMIN_URL || '/admin',
    serveAdminPanel: process.env.NODE_ENV === 'development',
    auth: {
      secret: process.env.ADMIN_JWT_SECRET || 'crum-blog-admin-secret',
    },
  },

  // API configuration
  api: {
    rest: {
      defaultLimit: 25,
      maxLimit: 100,
    },
  },

  // Security
  security: {
    xss: {
      enabled: true,
      mode: 'block',
    },
    csrf: {
      enabled: true,
    },
  },

  // CORS
  cors: {
    enabled: true,
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  },
};
