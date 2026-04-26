import rateLimit from 'express-rate-limit';

export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100, 
  message: {
    message: 'Too many requests from this IP, please try again after 15 minutes',
  },
  standardHeaders: true,
  legacyHeaders: false, 
  skipSuccessfulRequests: false, 
});

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 5, 
  message: {
    message: 'Too many authentication attempts, please try again after 15 minutes',
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
});

export const sensitiveLimiter = rateLimit({
  windowMs:  60 * 1000, 
  max: 3,
  message: {
    message: 'Too many requests for this operation, please try again after an hour',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export const googleAuthLimiter = rateLimit({
  windowMs:60 * 1000, 
  max: 10, 
  message: {
    message: 'Too many Google authentication attempts, please try again after an hour',
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
});

export const refreshTokenLimiter = rateLimit({
  windowMs: 60 * 1000, 
  max: 30, 
  message: {
    message: 'Too many token refresh attempts, please try again after an hour',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export const createUserSpecificLimiter = (maxRequests, windowMinutes = 15) => {
  return rateLimit({
    windowMs: windowMinutes * 60 * 1000,
    max: maxRequests,
    keyGenerator: (req) => {
      return req.user?.id || req.ip;
    },
    message: {
      message: `Too many requests, limit is ${maxRequests} requests per ${windowMinutes} minutes`,
    },
    standardHeaders: true,
    legacyHeaders: false,
  });
};