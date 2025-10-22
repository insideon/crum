module.exports = {
  // Database configuration
  database: {
    client: 'sqlite',
    connection: {
      filename: '.tmp/data.db',
    },
    useNullAsDefault: true,
  },

  // Server configuration
  server: {
    host: '0.0.0.0',
    port: process.env.PORT || 1337,
  },

  // Admin configuration
  admin: {
    auth: {
      secret: process.env.ADMIN_JWT_SECRET || 'crum-blog-admin-secret-key',
    },
    apiToken: {
      salt: process.env.API_TOKEN_SALT || 'crum-blog-api-token-salt',
    },
  },

  // API configuration
  api: {
    rest: {
      defaultLimit: 25,
      maxLimit: 100,
    },
  },
};
