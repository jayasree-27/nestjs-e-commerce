import { Global, Module } from '@nestjs/common';
import { configProviders } from './config.providers';
import { AppConfig } from './app.config';
import { DatabaseConfig } from './database.config';
import { RedisConfig } from './redis.config';
@Global()
@Module({
  imports: [],
  providers: [...configProviders, DatabaseConfig, AppConfig, RedisConfig],
  exports: [...configProviders, DatabaseConfig, AppConfig, RedisConfig],
})
export class ConfigModule {}
