import { Injectable } from '@nestjs/common';
import { ProductRepository } from '../repositories/product.repository';
import { CreateProductDto } from '../dtos/createProduct.dto';
import { User, UserRole } from '../../users/models/user.entity';
import { ForbiddenException } from '@nestjs/common';
import { UserRepository } from 'src/users/repositories/user.repository';

@Injectable()
export class ProductService {
  constructor(
    private productRepo: ProductRepository,
    private userRepo: UserRepository,
  ) {}
  async createProduct(userPayload: any, dto: CreateProductDto) {
    const userId = Number(userPayload.id);
    const user = await this.userRepo.findById(userId);
    if (!user) throw new ForbiddenException('User not found');
    return this.productRepo.create(user, dto);
  }

  async getProducts(loggedUser: User) {
    if (loggedUser.role === UserRole.ADMIN) {
      return await this.productRepo.findAll();
    } else {
      return await this.productRepo.findByUserId(loggedUser.id);
    }
  }

  async getProductsByUser(userId: number) {
    return await this.productRepo.findByUserId(userId);
  }
}
