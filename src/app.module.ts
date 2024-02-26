import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { UserEntity } from './users/entities/user.entity';
import { RoleEntity } from './users/entities/role.entity';
import { AuthModule } from './auth/auth.module';
import { VideoModule } from './video/video.module';
import { VideoEntity } from './video/entities/video.entity';
import { BlockedUsersModule } from './blocked-users/blocked-users.module';
import { BlockedUserEntity } from './blocked-users/entities/blocked-user.entity';
import { CommentModule } from './comment/comment.module';
import { CommentEntity } from './comment/entities/comment.entity';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: 5432,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [
        UserEntity,
        RoleEntity,
        VideoEntity,
        BlockedUserEntity,
        CommentEntity,
      ],
      synchronize: true,
    }),
    UsersModule,
    AuthModule,
    VideoModule,
    BlockedUsersModule,
    CommentModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
