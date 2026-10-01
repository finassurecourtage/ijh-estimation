import { MAX_PHOTOS_PER_HOUR_PER_IP } from "./constants";

const WINDOW_MS = 60 * 60 * 1000;

/**
 * Limiteur de débit en mémoire, par IP. Suffisant pour une instance Vercel
 * unique à faible trafic ; sur plusieurs instances serverless concurrentes
 * chaque instance a son propre compteur (voir README, section "Anti-abus").
 * Pour une limite garantie en production, remplacer par Upstash Redis ou
 * Vercel KV (clé partagée entre instances).
 */
const hits = new Map<string, number[]>();

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  limit: number;
}

export function checkRateLimit(
  ip: string,
  max: number = MAX_PHOTOS_PER_HOUR_PER_IP,
  namespace = "photo",
): RateLimitResult {
  const key = `${namespace}:${ip}`;
  const now = Date.now();
  const timestamps = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);

  if (timestamps.length >= max) {
    hits.set(key, timestamps);
    return { allowed: false, remaining: 0, limit: max };
  }

  timestamps.push(now);
  hits.set(key, timestamps);

  // Nettoyage ponctuel pour éviter une fuite mémoire sur une instance longue durée.
  if (hits.size > 5000) {
    for (const [k, value] of hits) {
      const fresh = value.filter((t) => now - t < WINDOW_MS);
      if (fresh.length === 0) hits.delete(k);
      else hits.set(k, fresh);
    }
  }

  return {
    allowed: true,
    remaining: max - timestamps.length,
    limit: max,
  };
}

export function getClientIp(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  const realIp = headers.get("x-real-ip");
  if (realIp) return realIp.trim();
  return "unknown";
}
