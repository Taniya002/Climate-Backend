import rateLimit from "express-rate-limit";

/**
 * Basic rate limiting to prevent abuse of the orchestrator endpoint, which
 * triggers multiple Gemini calls per request. Part of the security layer.
 */
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: "Too many requests. Please wait a few minutes before trying again.",
  },
});
