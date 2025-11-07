import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '../dtos/createUser.dto';
import { UserRepository } from '../repositories/user.repository';
import { UpdateUserDto } from '../dtos/updateUser.dto';
import { ForbiddenException } from '@nestjs/common';

@Injectable()
export class UserService {
  constructor(private readonly userRepo: UserRepository) {}

  findUserByEmail(email: string) {
    return this.userRepo.findByEmail(email);
  }

  createUser(user: CreateUserDto) {
    return this.userRepo.createUser(user);
  }

  async findAllUsers(loggedUser: any) {
    if (loggedUser.role !== 'admin') {
      throw new ForbiddenException('Only Admin can view all users!');
    }

    return this.userRepo.findAll();
  }

  findUserById(id: number) {
    return this.userRepo.findById(id);
  }

  async updateUser(id: number, updateData: UpdateUserDto) {
    const user = await this.userRepo.findById(id);
    if (!user) return null;

    const updatedUser = { ...user, ...updateData };

    return await this.userRepo.saveUser(updatedUser);
  }

  async deleteUser(id: number) {
    const user = await this.userRepo.findById(id);
    if (!user) return false;

    await this.userRepo.deleteUser(user);
    return true;
  }
}
