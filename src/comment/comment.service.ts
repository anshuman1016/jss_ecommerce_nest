import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { CommentEntity } from './entities/comment.entity';
import { VideoEntity } from 'src/video/entities/video.entity';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(CommentEntity)
    private commentRepository: Repository<CommentEntity>,
    @InjectRepository(VideoEntity)
    private videoRepository: Repository<VideoEntity>,
  ) {}

  async createComment(createCommentDto: CreateCommentDto, userId) {
    console.log('createCommentDto->', createCommentDto);
    const video = await this.videoRepository.findOne({
      where: { id: createCommentDto.videoId },
    });
    if (!video) {
      throw new Error('Video does not exist');
    }
    const createdComment = this.commentRepository.create({
      comment: createCommentDto.comment,
      commented_on: video.id,
      commented_by: userId,
      video_id: video,
      user_id: userId,
    });
    const comment = await this.commentRepository.save(createdComment);
    return comment;
  }

  findAll() {
    return `This action returns all comment`;
  }

  findOne(id: number) {
    return `This action returns a #${id} comment`;
  }

  update(id: number, updateCommentDto: UpdateCommentDto) {
    console.log(updateCommentDto);
    return `This action updates a #${id} comment`;
  }

  remove(id: number) {
    return `This action removes a #${id} comment`;
  }
}
