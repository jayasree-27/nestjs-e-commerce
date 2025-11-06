import { Controller, Post, Body, Req, Get, Param, ForbiddenException, ParseIntPipe } from '@nestjs/common';
import { ProductService } from '../services/product.service';
import { CreateProductDto } from '../dtos/createProduct.dto';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('products')
export class ProductController {
    constructor(private productService: ProductService) { }

@UseGuards(JwtAuthGuard)
  @Post()
  create(@Req() req, @Body() dto: CreateProductDto) {
    return this.productService.createProduct(req.user, dto);
  }

    @UseGuards(JwtAuthGuard)
    @Get()
    async getProducts(@Req() req: any) {
        try {
            console.log("user", req.user);
            return await this.productService.getProducts(req.user);
           
        }
        catch (err) {
            console.log("error", err);
        }
    }

}