import { Controller, Post, Body, ConflictException } from "@nestjs/common";
import { CreateUserDto } from "../dtos/createUser.dto";
import { UserService } from "../services/user.service";
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { UserRole } from "../models/user.entity"; 

@Controller("users")
export class UserController {
  constructor(private readonly userService: UserService) {}

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
      role: UserRole.USER
    });

    const token = jwt.sign(
      { id: createdUser.id, role: createdUser.role },
      process.env.JWT_SECRET || "SECRET_KEY",
      { expiresIn: "1d" }
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
}
