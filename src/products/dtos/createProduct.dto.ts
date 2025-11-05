import { IsNotEmpty, IsOptional, IsString, IsNumber, } from 'class-validator';

export class CreateProductDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsNotEmpty()
    @IsNumber()
    price: number;

    @IsOptional()
    @IsNumber()
    stock_quantity?: number;

    @IsOptional()
    created_at?: Date;

    @IsOptional()
    updated_at?: Date;
}

