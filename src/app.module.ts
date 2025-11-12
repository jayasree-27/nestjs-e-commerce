import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/models/user.entity';
import { UserModule } from './users/user.module';
import { ProductModule } from './product/product.module';
import { Product } from './product/models/product.entity';
import { AuthModule } from './auth/auth.module';
import { DatabaseConfig } from './config/database.config';
import { ConfigModule } from './config/config.module';
import { CacheModule } from '@nestjs/cache-manager';
import { RedisConfig } from './config/redis.config';
import * as redisStore from 'cache-manager-redis-store';
import { APP_GUARD } from '@nestjs/core';
import { RedisThrottlerGuard } from './auth/guards/throttle-redis.guard';
@Module({
  imports: [
    ConfigModule,
    CacheModule.registerAsync({
      inject: [RedisConfig],
      isGlobal: true,
      useFactory: (redisConfig: RedisConfig) => ({
        store: redisStore as any, // ✅ Enable Redis store here
        socket: {
          host: redisConfig.host,
          port: redisConfig.port,
        },
      }),
    }),

    TypeOrmModule.forRootAsync({
      inject: [DatabaseConfig],
      useFactory: (dbConfig: DatabaseConfig) => {
        console.log(dbConfig);
        return {
          type: 'postgres',
          host: dbConfig.host,
          port: dbConfig.port,
          username: dbConfig.username,
          password: dbConfig.password,
          database: dbConfig.name,
          entities: [User, Product],
          synchronize: true,
        };
      },
    }),
    UserModule,
    ProductModule,
    AuthModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: RedisThrottlerGuard,
    },
  ],
  exports: [],
})
export class AppModule {}
