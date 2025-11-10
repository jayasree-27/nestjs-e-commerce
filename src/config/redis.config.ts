import { Injectable, Inject } from '@nestjs/common';
import { ConvictSchema, Prop } from './decorators/convict';

@Injectable()
@ConvictSchema('redis')
export class RedisConfig {
  constructor(@Inject('CONFIG_SCHEMA') config: any) {
    const redis = config.redis;
    this.host = redis.host;
    this.port = redis.port;

    console.log('✅ Redis config loaded:', this);
  }
  @Prop({ format: String, default: 'localhost', env: 'REDIS_HOST' })
  host: string;

  @Prop({ format: Number, default: 6379, env: 'REDIS_PORT' })
  port: number;
}
