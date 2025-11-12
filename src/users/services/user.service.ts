import { Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from '../dtos/createUser.dto';
import { UserRepository } from '../repositories/user.repository';
import { UpdateUserDto } from '../dtos/updateUser.dto';
import { ForbiddenException } from '@nestjs/common';
import { User } from '../models/user.entity';
import { RedisStorage } from '../../infrastruxture/database/redis/redis.storage';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly redis: RedisStorage, // ✅ now Nest can inject it
  ) {}

  async findUserByEmail(email: string): Promise<User | null> {
    const cacheKey = `user_email_${email}`;
    const cached = await this.redis.get<User>(cacheKey);

    if (cached) {
      console.log('✅ Cache Hit (Email)');
      return cached;
    }

    const user = await this.userRepo.findByEmail(email);
    if (user) await this.redis.set(cacheKey, user, 300);

    return user;
  }

  async createUser(user: CreateUserDto) {
    const newUser = await this.userRepo.createUser(user);

    await this.redis.set(`user_email_${newUser.email}`, newUser, 300);
    await this.redis.set(`user_id_${newUser.id}`, newUser, 300);

    return newUser;
  }

  async findAllUsers(loggedUser: any): Promise<User[]> {
    if (loggedUser.role !== 'admin') {
      throw new ForbiddenException('Only Admin can view all users!');
    }

    const cacheKey = 'all_users';
    const cached = await this.redis.get<User[]>(cacheKey);

    if (cached) {
      console.log('✅ Cache Hit (All Users)');
      return cached;
    }

    const users = await this.userRepo.findAll();

    if (users) {
      await this.redis.set(cacheKey, users, 300);
      console.log('✅ Cached all users in Redis');
    }

    return users;
  }

  async findUserById(id: number): Promise<User | null> {
    const cacheKey = `user_id_${id}`;
    const cached = await this.redis.get<User>(cacheKey);

    if (cached) {
      console.log('✅ Cache Hit (ID)');
      return cached;
    }

    const user = await this.userRepo.findById(id);
    if (user) await this.redis.set(cacheKey, user, 300);

    return user;
  }

  async updateUser(id: number, updateData: UpdateUserDto) {
    const user = await this.userRepo.findById(id);
    if (!user) return null;

    const updatedUser = { ...user, ...updateData };
    const saved = await this.userRepo.saveUser(updatedUser);

    await this.redis.set(`user_id_${id}`, saved, 300);
    await this.redis.set(`user_email_${saved.email}`, saved, 300);

    await this.redis.delete('all_users');
    return saved;
  }

  async deleteUser(id: number) {
    const user = await this.userRepo.findById(id);
    if (!user) return false;

    await this.redis.delete(`user_id_${id}`);
    await this.redis.delete(`user_email_${user.email}`);
    await this.redis.delete('all_users');

    return true;
  }
}
