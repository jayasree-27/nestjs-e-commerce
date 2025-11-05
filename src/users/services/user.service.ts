import { Injectable } from "@nestjs/common";
import { CreateUserDto } from "../dtos/createUser.dto";
import { UserRepository } from "../repositories/user.repository";

@Injectable()
export class UserService {
  constructor(
    private readonly userRepo: UserRepository,
  ) {}

  findUserByEmail(email: string) {
    return this.userRepo.findByEmail(email);
  }

  createUser(user: CreateUserDto) {
    return this.userRepo.createUser(user);
  }
}
