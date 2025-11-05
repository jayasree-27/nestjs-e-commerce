import { Controller, Get, Post, Patch, Delete, Param, Body, Req, NotFoundException } from '@nestjs/common';
import type { ProductService } from '../services/product.service';
import type { CreateProductDto } from '../dtos/createProduct.dto';
import type { UpdateProductDto } from '../dtos/updateProduct.dto';
import type { Request } from 'express';
import { UserRole, User } from '../../users/models/user.entity';
import { UserService } from '../../users/services/user.service';

interface AuthenticatedRequest extends Request {
  user: { id: number; role: UserRole };
}

@Controller('products')
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    private readonly userService: UserService,
  ) {}

}
