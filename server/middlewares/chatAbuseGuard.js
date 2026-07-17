/**
 * Chat abuse guard — per-IP rate limit + global concurrency cap for public chat.
 * Used by chatRoute before the public POST /api/chat handler.
 * (No project-wide rate limiter package is installed; this is chat-scoped only.)
 */

const WINDOW_MS = 60_000;
const MAX_REQUESTS_PER_WINDOW = 20;
const MAX_CONCURRENT = 5;

/** @type {Map<string, { count: number, resetAt: number }>} */
const hitsByIp = new Map();
let inFlight = 0;

const getClientIp = (req) =>
  req.ip ||
  req.headers["x-forwarded-for"]?.toString().split(",")[0]?.trim() ||
  req.socket?.remoteAddress ||
  "unknown";

export const chatAbuseGuard = (req, res, next) => {
  const ip = getClientIp(req);
  const now = Date.now();

  let bucket = hitsByIp.get(ip);
  if (!bucket || now >= bucket.resetAt) {
    bucket = { count: 0, resetAt: now + WINDOW_MS };
    hitsByIp.set(ip, bucket);
  }

  bucket.count += 1;
  if (bucket.count > MAX_REQUESTS_PER_WINDOW) {
    return res.status(429).json({
      success: false,
      message: "Too many chat requests. Please wait a moment and try again.",
    });
  }

  if (inFlight >= MAX_CONCURRENT) {
    return res.status(503).json({
      success: false,
      message: "Chat is busy right now. Please try again in a moment.",
    });
  }

  inFlight += 1;
  let released = false;
  const release = () => {
    if (released) return;
    released = true;
    inFlight = Math.max(0, inFlight - 1);
  };

  res.on("finish", release);
  res.on("close", release);
  next();
};
