import { Controller, Post, Body, ConflictException, Get, Param, Patch, Delete } from "@nestjs/common";
import { CreateUserDto } from "../dtos/createUser.dto";
import { UserService } from "../services/user.service";
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { UserRole } from "../models/user.entity";
import { LoginUserDto } from "../dtos/loginUser.dto";
import { UnauthorizedException } from '@nestjs/common';
import { UpdateUserDto } from "../dtos/updateUser.dto";
import { NotFoundException } from '@nestjs/common';

@Controller("users")
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Post("register")
    async createUser(@Body() newUser: CreateUserDto) {
        const existingUser = await this.userService.findUserByEmail(newUser.email);

        if (existingUser) {
            throw new ConflictException("Email already exists");
        }

        const hashedPassword = await bcrypt.hash(newUser.password, 10);

        const createdUser = await this.userService.createUser({
            ...newUser,
            password: hashedPassword,
            role: newUser.role || UserRole.USER
        });

        const token = jwt.sign(
            { id: createdUser.id, role: createdUser.role },
            process.env.JWT_SECRET || "SECRET_KEY",
            { expiresIn: "10d" }
        );

        return {
            message: "User registered successfully",
            token,
            user: {
                id: createdUser.id,
                email: createdUser.email,
                role: createdUser.role,
                firstName: createdUser.first_name,
                lastName: createdUser.last_name
            }
        };
    }


    @Post("login")
    async login(@Body() loginDto: LoginUserDto) {
        const user = await this.userService.findUserByEmail(loginDto.email);

        if (!user) {
            throw new UnauthorizedException("Invalid email or the does not exists");
        }

        const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException("Invalid password");
        }

        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET || "SECRET_KEY",
            { expiresIn: "10d" }
        );

        return {
            message: "Login successful",
            token,
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
                firstName: user.first_name,
                lastName: user.last_name
            }
        };
    }

    @Get()
    getAllUsers() {
        return this.userService.findAllUsers();
    }

    @Get(":id")
    getUserById(@Param('id') id: number) {
        return this.userService.findUserById(id);
    }

    @Patch(':id')
    async updateUser(
        @Param('id') id: number,
        @Body() user: UpdateUserDto,
    ) {
        const result = await this.userService.updateUser(id, user);

        if (!result) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }

        return {
            message: 'User updated successfully ',
            data: result
        };
    }

    @Delete(':id')
    async deleteUser(@Param('id') id: number) {
        const deleted = await this.userService.deleteUser(id);

        if (!deleted) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }

        return {
            message: 'User deleted successfully',
        };
    }


}
