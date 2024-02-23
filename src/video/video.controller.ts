import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
  Req,
  Res,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Roles } from 'src/decorators/roles.decorators';
import { AuthGuard } from 'src/auth/auth.guard';
import { AuthorizationGuard } from 'src/auth/authorization.guard';
import { CreateVideoDto } from './dto/create-video.dto';
import { UpdateVideoDto } from './dto/update-video.dto';
import { VideoService } from './video.service';
import { CloudinaryService } from 'src/utility/cloudinary/cloudinary.service';
import { UsersService } from 'src/users/users.service';

interface CustomRequest extends Request {
  user: { id: number; email: string };
}

@Controller('video')
export class VideoController {
  constructor(
    private readonly videoService: VideoService,
    private readonly cloudinaryService: CloudinaryService,
    private readonly userService: UsersService,
  ) {}

  @Post('create')
  @Roles(['ADMIN'])
  @UseGuards(AuthGuard, AuthorizationGuard)
  @UseInterceptors(FilesInterceptor('videoUrl'))
  async create(
    @Req() req: CustomRequest,
    @Res() res: Response,
    @Body() createVideoDto: CreateVideoDto,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    try {
      const { id } = req.user;
      const findUser = await this.userService.UserRepository.findOne({
        where: { email: req.user.email },
      });
      if (!findUser) {
        throw new Error('User does not exist!');
      }
      const result = await this.cloudinaryService.uploadVideo(files);
      createVideoDto.videoUrl = [];
      for (let i = 0; i < result.length; i++) {
        createVideoDto.videoUrl.push(result[i].secure_url);
      }
      const video = await this.videoService.createVideo(createVideoDto, id);
      return res.status(201).json({
        success: true,
        videoData: video,
      });
    } catch (err) {
      res.status(400).json({
        success: false,
        message: err.message,
      });
    }
  }

  @Roles(['ADMIN', 'USER'])
  @UseGuards(AuthGuard, AuthorizationGuard)
  @Get('get-allVideos')
  async findAll(@Req() req: CustomRequest, @Res() res: Response) {
    try {
      const findUser = await this.userService.UserRepository.findOne({
        where: { email: req.user.email },
      });
      if (!findUser) {
        throw new Error('User does not exist!');
      }
      const allVideos = await this.videoService.findAll();
      res.status(200).json({
        success: true,
        videos: allVideos,
      });
    } catch (err) {
      res.status(400).json({
        success: false,
        message: err.message,
      });
    }
  }

  @Roles(['ADMIN', 'USER'])
  @UseGuards(AuthGuard, AuthorizationGuard)
  @Get('get-videoOfAUser')
  async findOne(@Req() req: CustomRequest, @Res() res: Response) {
    try {
      const findUser = await this.userService.UserRepository.findOne({
        where: { email: req.user.email },
      });
      if (!findUser) {
        throw new Error('User does not exist!');
      }
      const video = await this.videoService.findOne(+findUser.id);
      res.status(200).json({
        success: true,
        videos: video,
      });
    } catch (err) {
      res.status(400).json({
        success: false,
        message: err.message,
      });
    }
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateVideoDto: UpdateVideoDto) {
    return this.videoService.update(+id, updateVideoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.videoService.remove(+id);
  }
}
