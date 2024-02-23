import { Injectable } from '@nestjs/common';
import { CreateVideoDto } from './dto/create-video.dto';
import { UpdateVideoDto } from './dto/update-video.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { VideoEntity } from './entities/video.entity';
import { Repository } from 'typeorm';

@Injectable()
export class VideoService {
  constructor(
    @InjectRepository(VideoEntity)
    private videoRepository: Repository<VideoEntity>,
  ) {}
  async createVideo(createVideoDto: CreateVideoDto, id) {
    const createdVideo = this.videoRepository.create({
      ...createVideoDto,
      createdBy: id,
    });
    const videoData = await this.videoRepository.save(createdVideo);
    return videoData;
  }

  async findAll() {
    const videos = await this.videoRepository.find();
    return videos;
  }

  async findOne(userId) {
    console.log('userId->', typeof userId);
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
