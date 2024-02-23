import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { UserEntity } from 'src/users/entities/user.entity';
import { VideoType } from '../entities/video.entity';

export class CreateVideoDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsNumber()
  price: number;

  @IsNotEmpty()
  @IsString()
  videoUrl: string[];

  isVideoType: VideoType;

  createdBy: number;
}
