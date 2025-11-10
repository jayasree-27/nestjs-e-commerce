import { Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from '../dtos/createUser.dto';
import { UserRepository } from '../repositories/user.repository';
import { UpdateUserDto } from '../dtos/updateUser.dto';
import { ForbiddenException } from '@nestjs/common';
import { CACHE_MANAGER, Cache} from '@nestjs/cache-manager';
import { User } from '../models/user.entity';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepo: UserRepository,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async findUserByEmail(email: string): Promise<User | null> {
    const cacheKey = `user_email_${email}`;
    const cached = await this.cacheManager.get(cacheKey);
    if (cached) {
      console.log('cache hit');
      return cached as User;
    }
    const user = await this.userRepo.findByEmail(email);
    if (user) await this.cacheManager.set(cacheKey, user); // cache 5 min
    return user;
  }

  async createUser(user: CreateUserDto) {
    const newUser = await this.userRepo.createUser(user);
    // optionally cache by email/id
    await this.cacheManager.set(`user_email_${newUser.email}`, newUser);
    await this.cacheManager.set(`user_id_${newUser.id}`, newUser);
    return newUser;
  }

  async findAllUsers(loggedUser: any) {
    if (loggedUser.role !== 'admin') {
      throw new ForbiddenException('Only Admin can view all users!');
    }

    const cacheKey = 'all_users';
    const cached = await this.cacheManager.get(cacheKey);
    if (cached) {
      console.log('cache hit');
      return cached;
    }
    const users = await this.userRepo.findAll();
    if (users) {
      await this.cacheManager.set(cacheKey, users);
    }
    return users;
  }

  async findUserById(id: number): Promise<User | null> {
    const cacheKey = `user_id_${id}`;
    const cached = await this.cacheManager.get(cacheKey);
    if (cached) {
      console.log('cache hit');
      return cached as User;
    }
    const user = await this.userRepo.findById(id);
    if (user) {
      await this.cacheManager.set(cacheKey, user);
    }
    return user;
  }

  async updateUser(id: number, updateData: UpdateUserDto) {
    const user = await this.userRepo.findById(id);
    if (!user) return null;

    const updatedUser = { ...user, ...updateData };
    const saved = await this.userRepo.saveUser(updatedUser);

    await this.cacheManager.set(`user_id_${id}`, saved);
    await this.cacheManager.set(`user_email_${saved.email}`, saved);

    await this.cacheManager.del('all_users');
    return saved;
  }

  async deleteUser(id: number) {
    const user = await this.userRepo.findById(id);
    if (!user) return false;

    await this.cacheManager.del(`user_id_${id}`);
    await this.cacheManager.del(`user_email_${user.email}`);
    await this.cacheManager.del('all_users');

    return true;
  }
}
