import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../models/product.entity';
import { User } from '../../users/models/user.entity';
import { CreateProductDto } from '../dtos/createProduct.dto';

@Injectable()
export class ProductRepository {
  constructor(
    @InjectRepository(Product)
    private readonly repo: Repository<Product>,
  ) {}

  async create(owner: User, dto: CreateProductDto) {
    const product = this.repo.create({ ...dto, owner }); // owner must be User object
    return await this.repo.save(product);
  }

  async findAll() {
    return await this.repo.find({
      relations: ['owner'],
    });
  }

  async findByUserId(userId: number) {
    const products = await this.repo.find({
      where: { owner: { id: userId } },
      relations: ['owner'],
    });
    console.log('Products found:', products);
    return products;
  }
}
