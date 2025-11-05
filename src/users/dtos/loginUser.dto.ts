import {IsString, IsEmail, IsNotEmpty, MinLength } from "class-validator";

export class LoginUserDto{
    @IsEmail()
    @IsNotEmpty()
    email:string;

    @IsNotEmpty()
    @MinLength(8)
    @IsString()
    password:string;
}