import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/models/user.entity';
import { UserModule } from './users/user.module';
import { ConfigService } from '@nestjs/config';
import { ProductModule } from './product/product.module';
import { Product } from './product/models/product.entity';
import { AuthModule } from './auth/auth.module';
import { configModule } from './config/config.module';
@Module({
  imports: [
    configModule,
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('database.host'),
        port: config.get<number>('database.port'),
        username: config.get<string>('database.username'),
        password: config.get<string>('database.password'),
        database: config.get<string>('database.name'),
        entities: [User, Product],
        synchronize: config.get<boolean>('database.synchronize'),
      }),
    }),
    UserModule,
    ProductModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
