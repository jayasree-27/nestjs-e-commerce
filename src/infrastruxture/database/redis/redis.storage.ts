import { Redis } from 'ioredis';

export class RedisStorage {
  constructor(
    private readonly client: Redis,
    private readonly hashKey: string = 'app_cache',
  ) {}

  async set<T>(key: string, value: T, duration?: number): Promise<boolean> {
    try {
      const stringValue = JSON.stringify(value);
      await this.client.hset(this.hashKey, key, stringValue);

      if (duration) {
        await this.client.expire(this.hashKey, duration);
      }

      return true;
    } catch (error) {
      console.error('Redis set error:', error);
      return false;
    }
  }

  async exist(key: string): Promise<boolean> {
    try {
      const result = await this.client.hexists(this.hashKey, key);
      return result === 1;
    } catch (error) {
      console.error('Redis exist error:', error);
      return false;
    }
  }

  async get<T>(key: string): Promise<T | null> {
    try {
      const data = await this.client.hget(this.hashKey, key);
      return data ? (JSON.parse(data) as T) : null;
    } catch (error) {
      console.error('Redis get error:', error);
      return null;
    }
  }

  async delete(key: string): Promise<boolean> {
    try {
      const result = await this.client.hdel(this.hashKey, key);
      return result > 0;
    } catch (error) {
      console.error('Redis delete error:', error);
      return false;
    }
  }

  async getValues<T>(): Promise<T[]> {
    try {
      const values = await this.client.hvals(this.hashKey);
      return values
        .map((val) => {
          try {
            return JSON.parse(val) as T;
          } catch {
            return null;
          }
        })
        .filter((item): item is T => item !== null);
    } catch (error) {
      console.error('Redis getValues error:', error);
      return [];
    }
  }

  async getAll<T>(): Promise<Record<string, T>> {
    try {
      const structured: Record<string, T> = {};
      const entries = await this.client.hgetall(this.hashKey);

      for (const [key, val] of Object.entries(entries)) {
        try {
          structured[key] = JSON.parse(val) as T;
        } catch (err) {
          console.error(`Error parsing key "${key}" value:`, err);
          structured[key] = {} as T;
        }
      }

      return structured;
    } catch (error) {
      console.error('Redis getAll error:', error);
      return {};
    }
  }

  async expire(duration: number): Promise<boolean> {
    try {
      const result = await this.client.expire(this.hashKey, duration);
      return result === 1;
    } catch (error) {
      console.error('Redis expire error:', error);
      return false;
    }
  }

  async keys(pattern: string): Promise<string[]> {
    try {
      return await this.client.keys(pattern);
    } catch (error) {
      console.error('Redis keys error:', error);
      return [];
    }
  }

  async getMany<T>(keys: string[]): Promise<T[]> {
    try {
      if (!keys.length) return [];

      const values = await this.client.hmget(this.hashKey, ...keys);

      return values
        .map((val) => {
          if (!val) return null;
          try {
            return JSON.parse(val) as T;
          } catch {
            return null;
          }
        })
        .filter((item): item is T => item !== null);
    } catch (error) {
      console.error('Redis getMany error:', error);
      return [];
    }
  }
}
