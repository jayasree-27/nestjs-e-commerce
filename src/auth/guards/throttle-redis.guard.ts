import {
  SetMetadata,
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { RedisConfig } from '../../config/redis.config';
import Redis from 'ioredis';
import { Reflector } from '@nestjs/core';

export const RATE_LIMIT = 'rate_limit';
// limit: number of requests, ttl: time window in seconds, ttl: time to live
export const Throttle = (limit: number, ttl: number) =>
  SetMetadata(RATE_LIMIT, { limit, ttl });

@Injectable()
export class RedisThrottlerGuard implements CanActivate {
  private redis: Redis;

  constructor(
    private readonly redisConfig: RedisConfig,
    private readonly reflector: Reflector,
  ) {
    this.redis = new Redis({
      host: redisConfig.host,
      port: redisConfig.port,
      tls: redisConfig.tls ? redisConfig.tlsOptions : undefined,
    });
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    console.log('RedisThrottlerGuard activated for IP:', req.ip);
    // Read custom limit & ttl from route metadata
    const meta = this.reflector.get<{ limit: number; ttl: number }>(
      RATE_LIMIT,
      context.getHandler(),
    );
    // const limit = meta?.limit ?? 10; // fallback to global
    // const ttl = meta?.ttl ?? 60;

    if (
      !meta ||
      typeof meta.limit !== 'number' ||
      typeof meta.ttl !== 'number'
    ) {
      throw new HttpException(
        {
          statusCode: 500,
          message: `Rate limiting metadata missing. Please define @Throttle(limit, ttl) on this route.`,
          hint: 'Example: @Throttle(5, 60)',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    const { limit, ttl } = meta;

    const key = `throttle:${req.ip}`;
    const now = Date.now();
    const recordRaw = await this.redis.get(key);
    let timestamps: number[] = recordRaw ? JSON.parse(recordRaw) : [];

    timestamps = timestamps.filter((ts) => now - ts < ttl * 1000);

    if (timestamps.length >= limit) {
      const retryAfter = ttl - Math.floor((Date.now() - timestamps[0]) / 1000);
      throw new HttpException(
        {
          statusCode: 429,
          message: `Rate limit exceeded. Try again in ${retryAfter} seconds.`,
          retryAfter,
        },
        HttpStatus.TOO_MANY_REQUESTS, // 429
      );
    }

    timestamps.push(now);
    await this.redis.set(key, JSON.stringify(timestamps), 'PX', ttl * 1000);

    return true;
  }
}
