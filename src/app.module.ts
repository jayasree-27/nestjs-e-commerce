import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/models/user.entity';
import { UserModule } from './users/user.module';
import { ProductModule } from './product/product.module';
import { Product } from './product/models/product.entity';
import { AuthModule } from './auth/auth.module';
import { DatabaseConfig } from './config/database.config';
import { ConfigModule } from './config/config.module';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forRootAsync({
      inject: [DatabaseConfig],
      useFactory: (dbConfig: DatabaseConfig) => {
        console.log(dbConfig);
        return {
          type: 'postgres',
          host: 'localhost',
          port: 5432,
          username: 'postgres',
          password: 'jayasree275',
          database: 'nestjs_ecommerce',
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
  providers: [],
})
export class AppModule {}
