import { IsEmail, IsEnum, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { UserRole } from "../models/user.entity";

export class CreateUserDto {

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsString()
    @IsNotEmpty()
    password: string;

    @IsString()
    @IsOptional()
    first_name: string;

    @IsString()
    @IsOptional()
    last_name: string;

    @IsEnum(UserRole)
    role: UserRole;
    
    @IsOptional()
    created_at: Date;
    @IsOptional()
    updated_at: Date;
}

