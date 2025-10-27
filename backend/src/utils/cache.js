import { LRUCache } from "lru-cache";

const cache = new LRUCache({ max: 500, ttl: 1000 * 300 });

export function cacheMiddleware(ttlSeconds = 60) {
  return (req, res, next) => {
    const key = req.originalUrl;
    const hit = cache.get(key);
    if (hit) return res.json(hit);
    const json = res.json.bind(res);
    res.json = (body) => {
      cache.set(key, body, { ttl: ttlSeconds * 1000 });
      return json(body);
    };
    next();
  };
}
