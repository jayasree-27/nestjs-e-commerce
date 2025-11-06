import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './models/product.entity';
import { ProductRepository } from './repositories/product.repository';
import { ProductController } from './controller/product.controller';
import { ProductService } from './services/product.service';
import { User } from 'src/users/models/user.entity';
import { UserRepository } from 'src/users/repositories/user.repository';

@Module({
    imports:[TypeOrmModule.forFeature([Product,User])],
    controllers: [ProductController],
    providers: [ProductRepository,ProductService,UserRepository],
    exports: [ProductService]
})
export class ProductModule {}
