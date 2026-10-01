// Lightweight Token Bucket Rate Limiter for SAKHI API endpoints

const REQUEST_LIMIT = 30; // Max requests per window
const WINDOW_MS = 60 * 1000; // 1 minute window

interface RateLimitStore {
  count: number;
  resetTime: number;
}

const rateLimitMap = new Map<string, RateLimitStore>();

export function checkRateLimit(identifier: string): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const userStore = rateLimitMap.get(identifier);

  if (!userStore || now > userStore.resetTime) {
    rateLimitMap.set(identifier, {
      count: 1,
      resetTime: now + WINDOW_MS,
    });
    return { allowed: true, remaining: REQUEST_LIMIT - 1 };
  }

  if (userStore.count >= REQUEST_LIMIT) {
    return { allowed: false, remaining: 0 };
  }

  userStore.count += 1;
  return { allowed: true, remaining: REQUEST_LIMIT - userStore.count };
}
