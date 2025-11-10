import { Global, Module } from '@nestjs/common';
import { configProviders } from './config.providers';
import { AppConfig } from './app.config';
import { DatabaseConfig } from './database.config';
@Global()
@Module({
  imports: [],
  providers: [...configProviders, DatabaseConfig, AppConfig],
  exports: [...configProviders, DatabaseConfig, AppConfig],
})
export class ConfigModule {}
