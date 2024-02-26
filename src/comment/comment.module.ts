import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentEntity } from './entities/comment.entity';
import { AuthService } from 'src/auth/auth.service';
import { UserEntity } from 'src/users/entities/user.entity';
import { RoleEntity } from 'src/users/entities/role.entity';
import { VideoEntity } from 'src/video/entities/video.entity';
import { UsersService } from 'src/users/users.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CommentEntity,
      UserEntity,
      RoleEntity,
      VideoEntity,
    ]),
  ],
  controllers: [CommentController],
  providers: [CommentService, AuthService, UsersService],
})
export class CommentModule {}
