import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/models/user.entity';
import { UserModule } from './users/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ProductModule } from './product/product.module';
import { Product } from './product/models/product.entity';
import { AuthModule } from './auth/auth.module';


@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule, UserModule,ProductModule,AuthModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('DB_HOST'),
        port: config.get<number>('DB_PORT'),
        username: config.get<string>('DB_USERNAME'),
        password: config.get<string>('DB_PASSWORD'),
        database: config.get<string>('DB_NAME'),
        entities: [User,Product],
        synchronize: config.get<boolean>('DB_SYNC'),
      })
    }),],
  controllers: [],
  providers: [],
})
export class AppModule { }
