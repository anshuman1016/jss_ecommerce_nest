import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlockedUsersService } from './blocked-users.service';
import { BlockedUsersController } from './blocked-users.controller';
import { AuthService } from 'src/auth/auth.service';
import { UsersService } from 'src/users/users.service';
import { BlockedUserEntity } from './entities/blocked-user.entity';
import { UserEntity } from 'src/users/entities/user.entity';
import { RoleEntity } from 'src/users/entities/role.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([BlockedUserEntity, UserEntity, RoleEntity]),
  ],
  controllers: [BlockedUsersController],
  providers: [BlockedUsersService, AuthService, UsersService],
})
export class BlockedUsersModule {}
