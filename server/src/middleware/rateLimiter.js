import rateLimit from 'express-rate-limit'

// Every request here calls a paid API — throttle per IP so a stray
// script (or a published public URL) can't run up the Anthropic bill.
export const generateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  limit: 10, // 10 requests per minute per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests. Please wait a moment and try again.' },
})
