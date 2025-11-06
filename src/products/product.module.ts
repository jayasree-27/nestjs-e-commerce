import { Module } from '@nestjs/common';
import { Product } from './models/product.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../users/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([Product]), UserModule],
  controllers: [],
  providers: [ ],
})
export class ProductModule {}

