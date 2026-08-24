import dotenv from 'dotenv';
dotenv.config();

export const ENV = {
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  CLIENT_URL: process.env.CLIENT_URL || '*',
  ADMIN_URL: process.env.ADMIN_URL || '*',
  MONGO_URI: process.env.MONGO_URI || 'mongodb+srv://vizdigitalofficial_db_user:OTLDN4YMD4Ju3N14@rishta24.zqkydu4.mongodb.net/rishta24?retryWrites=true&w=majority&appName=Rishta24',
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET || 'rishta24_super_secure_access_secret_key_2026_jwt_token',
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || 'rishta24_super_secure_refresh_secret_key_2026_jwt_token',
  JWT_ACCESS_EXPIRES_IN: process.env.JWT_ACCESS_EXPIRES_IN || '1h',
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID || 'rzp_test_rishta24_demo_key',
  RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET || 'rzp_test_secret_demo_secret_2026',
  RAZORPAY_WEBHOOK_SECRET: process.env.RAZORPAY_WEBHOOK_SECRET || 'rzp_webhook_secret_rishta24',
  UPLOAD_PATH: process.env.UPLOAD_PATH || './uploads',
  LOG_LEVEL: process.env.LOG_LEVEL || 'debug',
};
