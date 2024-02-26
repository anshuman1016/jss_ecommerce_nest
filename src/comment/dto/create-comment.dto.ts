import { IsNumber, IsString } from 'class-validator';
import { UserEntity } from 'src/users/entities/user.entity';
import { VideoEntity } from 'src/video/entities/video.entity';

export class CreateCommentDto {
  @IsString()
  comment: string;

  @IsNumber()
  commented_on: number;

  videoId: number;

  @IsNumber()
  commented_by: number;

  video_id: VideoEntity;

  user_id: UserEntity;
}
