require('dotenv').config();

module.exports = {
  // Server Configuration
  server: {
    port: process.env.PORT || 3000,
    nodeEnv: process.env.NODE_ENV || 'development'
  },

  // Supabase Configuration
  supabase: {
    url: process.env.SUPABASE_URL || '',
    anonKey: process.env.SUPABASE_ANON_KEY || '',
    serviceKey: process.env.SUPABASE_SERVICE_ROLE_KEY || ''
  },

  // JWT Configuration
  jwt: {
    secret: process.env.JWT_SECRET || 'your_super_secret_jwt_key_change_this_in_production',
    expiration: process.env.JWT_EXPIRATION || '24h',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'your_super_secret_refresh_key',
    refreshExpiration: process.env.JWT_REFRESH_EXPIRATION || '7d'
  },

  // API Configuration
  api: {
    baseUrl: process.env.API_BASE_URL || '/api/v1',
    version: 'v1'
  },

  // Ollama Configuration
  ollama: {
    baseUrl: process.env.OLLAMA_URL || 'http://localhost:11434',
    model: process.env.OLLAMA_MODEL || 'mistral',
    temperature: parseFloat(process.env.OLLAMA_TEMPERATURE || '0.7'),
    topP: parseFloat(process.env.OLLAMA_TOP_P || '0.9'),
    topK: parseInt(process.env.OLLAMA_TOP_K || '40'),
    numPredict: parseInt(process.env.OLLAMA_NUM_PREDICT || '512'),
    timeout: parseInt(process.env.OLLAMA_TIMEOUT || '120000') // 120 seconds - First response can be slow
  },

  // CORS Configuration
  cors: {
    origin: [
      process.env.CORS_ORIGIN || 'http://localhost:5500',
      'http://127.0.0.1:5500',
      'http://localhost:3000',
      'http://127.0.0.1:3000'
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    optionsSuccessStatus: 200
  }
};
