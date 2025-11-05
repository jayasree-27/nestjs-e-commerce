import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Product } from '../models/product.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ProductRepository {
  constructor(
    @InjectRepository(Product)
    private readonly repo: Repository<Product>
  ) {}

  createProduct(productData: Partial<Product>) {
    const product = this.repo.create(productData);
    return this.repo.save(product);
  }

}
