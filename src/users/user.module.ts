import { Module } from '@nestjs/common';
import { UserService } from './services/user.service';
import { UserController } from './controller/user.controller';
import { User } from './models/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from './repositories/user.repository';
import { RedisModule } from '../infrastruxture/database/redis/redis.module';
@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    RedisModule.forRoot('user_cache'), // ✅ hashKey for this module
  ],
  controllers: [UserController],
  providers: [UserService, UserRepository],
  exports: [],
})
export class UserModule {}
