import { Injectable, ForbiddenException } from '@nestjs/common';
import { ProductRepository } from '../repositories/product.repository';
import { CreateProductDto } from '../dtos/createProduct.dto';
import { User } from '../../users/models/user.entity'
import { UserRole } from '../../users/models/user.entity';

@Injectable()
export class ProductService {
  constructor(private readonly productRepo: ProductRepository) {}

  async createProduct(user: User, dto: CreateProductDto) {
    if (user.role !== UserRole.ADMIN) {
      throw new ForbiddenException("Only admin can create products");
    }
    return this.productRepo.createProduct({ ...dto });
  }
  
}
