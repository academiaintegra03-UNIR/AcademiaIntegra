import "server-only";

/**
 * In-memory sliding-window rate limiter for public, unauthenticated Route
 * Handlers (e.g. the Álex chat endpoint). Deliberately simple: resets on
 * server restart and isn't shared across instances in a multi-server
 * deployment. Good enough to stop a single abusive client from burning
 * through the Gemini quota; swap for Upstash/Redis if this ever needs to
 * hold up under real multi-instance production traffic.
 */
const hits = new Map<string, number[]>();

export function isRateLimited(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const windowStart = now - windowMs;
  const timestamps = (hits.get(key) ?? []).filter((t) => t > windowStart);

  if (timestamps.length >= limit) {
    hits.set(key, timestamps);
    return true;
  }

  timestamps.push(now);
  hits.set(key, timestamps);
  return false;
}
