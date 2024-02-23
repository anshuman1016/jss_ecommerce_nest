import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { RoleEntity } from './entities/role.entity';
import { AuthService } from 'src/auth/auth.service';
import { CloudinaryService } from 'src/utility/cloudinary/cloudinary.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, RoleEntity])],
  controllers: [UsersController],
  providers: [UsersService, AuthService, CloudinaryService],
  exports: [UsersService],
})
export class UsersModule {}
