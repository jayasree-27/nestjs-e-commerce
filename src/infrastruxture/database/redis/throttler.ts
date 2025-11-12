// src/infrastruxture/database/redis/throttler.ts
import Redis from 'ioredis';

export class RedisThrottlerStorage {
  private client: Redis;

  constructor() {
    this.client = new Redis({ host: 'localhost', port: 6379 });
  }

  async increment(
    key: string,
    ttl: number,
    // include optional params if relevant
    limit?: number,
    blockDuration?: number,
    throttlerName?: string,
  ): Promise<{ totalHits: number; timeToExpire: number }> {
    const now = Date.now();
    const raw = await this.client.get(key);
    const hits: number[] = raw ? JSON.parse(raw) : [];
    const cutoff = now - ttl * 1000;
    const filtered = hits.filter((ts) => ts > cutoff);
    filtered.push(now);
    const newHits = filtered.length;
    const timeToExpire = ttl * 1000 - (now - filtered[0]);
    await this.client.set(key, JSON.stringify(filtered), 'PX', ttl * 1000);
    return { totalHits: newHits, timeToExpire };
  }
}
