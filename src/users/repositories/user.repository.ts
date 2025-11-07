import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../models/user.entity';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User)
    private readonly repo: Repository<User>,
  ) {}

  async findByEmail(email: string) {
    return await this.repo.findOne({ where: { email } });
  }

  async findAll() {
    return await this.repo.find();
  }

  async createUser(userData: Partial<User>) {
    const user = this.repo.create(userData);
    return await this.repo.save(user);
  }

  async findById(id: number) {
    return await this.repo.findOne({
      where: { id },
    });
  }

  async saveUser(user: User) {
    return await this.repo.save(user);
  }

  async deleteUser(user: User) {
    await this.repo.remove(user);
  }
}
