import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VideoService } from './video.service';
import { VideoController } from './video.controller';
import { VideoEntity } from './entities/video.entity';
import { CloudinaryService } from 'src/utility/cloudinary/cloudinary.service';
import { AuthService } from 'src/auth/auth.service';
import { UserEntity } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { RoleEntity } from 'src/users/entities/role.entity';
import { BlockedUserEntity } from 'src/blocked-users/entities/blocked-user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      VideoEntity,
      UserEntity,
      RoleEntity,
      BlockedUserEntity,
    ]),
  ],
  controllers: [VideoController],
  providers: [VideoService, CloudinaryService, AuthService, UsersService],
})
export class VideoModule {}
