import { Provider } from '@nestjs/common';
import Redis from 'ioredis';
import { RedisConfig } from '../../../config/redis.config';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import { RedisStorage } from './redis.storage';

export const REDIS_CLIENT = 'REDIS_CLIENT';
export const HASH_KEY = 'HASH_KEY';
export const PUB_SUB = 'PUB_SUB';

export const redisProviders: Provider[] = [
  {
    provide: REDIS_CLIENT,
    useFactory: (config: RedisConfig) => {
      const client = new Redis({
        host: config.host,
        port: config.port,
        tls: config.tls ? config.tlsOptions : undefined,
      });

      client.on('connect', () => console.log('✅ Redis Connected'));
      client.on('error', (err) => console.error('❌ Redis Error:', err));

      return client;
    },
    inject: [RedisConfig],
  },
];

export const createRedisHashProvider = (hashKey: string): Provider[] => [
  ...redisProviders,
  {
    provide: HASH_KEY,
    useValue: hashKey,
  },
  {
    provide: RedisStorage,
    useFactory: (client: Redis, hashKey: string) => {
      console.log(`✅ Redis Hash Storage initialized: ${hashKey}`);
      return new RedisStorage(client, hashKey);
    },
    inject: [REDIS_CLIENT, HASH_KEY],
  },
  {
    provide: PUB_SUB,
    useFactory: (config: RedisConfig) =>
      new RedisPubSub({
        connection: {
          host: config.host,
          port: config.port,
          //   papassssword: config.,
          retryStrategy: () => 2000,
        },
      }),
    inject: [RedisConfig],
  },
];
