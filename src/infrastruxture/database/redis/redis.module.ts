import { DynamicModule, Global, Module } from '@nestjs/common';
import { createRedisHashProvider } from './redis.provider';

@Global()
@Module({
  imports: [],
})
export class RedisModule {
  static forRoot(hashKey: string): DynamicModule {
    const providers = createRedisHashProvider(hashKey);

    return {
      module: RedisModule,
      providers,
      exports: providers,
    };
  }
}
