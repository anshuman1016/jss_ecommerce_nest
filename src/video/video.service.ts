import { Injectable } from '@nestjs/common';
import { CreateVideoDto } from './dto/create-video.dto';
import { UpdateVideoDto } from './dto/update-video.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { VideoEntity } from './entities/video.entity';
import { In, Not, Repository } from 'typeorm';
import { BlockedUserEntity } from 'src/blocked-users/entities/blocked-user.entity';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class VideoService {
  constructor(
    @InjectRepository(VideoEntity)
    private videoRepository: Repository<VideoEntity>,
    @InjectRepository(BlockedUserEntity)
    private readonly blockedUserRepository: Repository<BlockedUserEntity>,
    private readonly userService: UsersService,
  ) {}
  async createVideo(createVideoDto: CreateVideoDto, id) {
    const createdVideo = this.videoRepository.create({
      ...createVideoDto,
      createdBy: id,
      user_id: id,
    });
    const videoData = await this.videoRepository.save(createdVideo);
    return videoData;
  }

  async findAllVideos(email) {
    const user = await this.userService.UserRepository.findOne({
      where: { email: email },
    });
    const blockedUsers = await this.blockedUserRepository.find({
      where: { blocked_by: user.id },
    });
    const blockedBy = await this.blockedUserRepository.find({
      where: { blocked_user: user.id },
    });
    let blockUsersIds = [];
    if (blockedUsers.length > 0) {
      const block_user_id = blockedUsers.map((blockedUsersId) => {
        return blockedUsersId.blocked_user;
      });
      blockUsersIds = block_user_id;
    }
    let blockedByIds = [];
    if (blockedBy.length > 0) {
      const block_by_ids = blockedBy.map((blockedByUsersId) => {
        return blockedByUsersId.blocked_by;
      });
      blockedByIds = block_by_ids;
    }
    const allBlockIds = [...blockUsersIds, ...blockedByIds];
    const videos = await this.videoRepository.find({
      where: { createdBy: Not(In(allBlockIds)) },
    });
    if (!videos) {
      throw new Error('No videos found!');
    }
    return videos;
  }

  async findVideo(userId) {
    console.log('userId->', userId);
    const findVideo = await this.videoRepository.find({
      where: { createdBy: userId },
    });
    if (!findVideo) {
      throw new Error('No Videos Found');
    }
    return findVideo;
  }

  update(id: number, updateVideoDto: UpdateVideoDto) {
    console.log(updateVideoDto);
    return `This action updates a #${id} video`;
  }

  remove(id: number) {
    return `This action removes a #${id} video`;
  }
}
