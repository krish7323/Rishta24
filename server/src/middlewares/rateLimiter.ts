import rateLimit from 'express-rate-limit';

export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // 1000 requests per IP to support high concurrent activity
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again after 15 minutes.',
    code: 'RATE_LIMIT_EXCEEDED',
  },
});

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 login/register/otp requests per IP to support high test throughput
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many authentication attempts, please try again in 15 minutes.',
    code: 'AUTH_RATE_LIMIT_EXCEEDED',
  },
});

export const searchLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 300, // 300 search requests per minute to support high concurrent browsing
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Search rate limit exceeded. Please slow down.',
    code: 'SEARCH_RATE_LIMIT_EXCEEDED',
  },
});

export const chatLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 120, // 120 message requests per minute
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Messaging rate limit exceeded.',
    code: 'CHAT_RATE_LIMIT_EXCEEDED',
  },
});

export const paymentLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30, // 30 order creation attempts
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Payment order rate limit exceeded.',
    code: 'PAYMENT_RATE_LIMIT_EXCEEDED',
  },
});
