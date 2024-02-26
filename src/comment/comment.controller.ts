import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Res,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Roles } from 'src/decorators/roles.decorators';
import { AuthGuard } from 'src/auth/auth.guard';
import { AuthorizationGuard } from 'src/auth/authorization.guard';
import { UsersService } from 'src/users/users.service';

interface CustomRequest extends Request {
  user: { id: number; email: string };
}

@Controller('comment')
export class CommentController {
  constructor(
    private readonly commentService: CommentService,
    private readonly userService: UsersService,
  ) {}

  @Roles(['ADMIN', 'USER'])
  @UseGuards(AuthGuard, AuthorizationGuard)
  @Post('create')
  async create(
    @Body() createCommentDto: CreateCommentDto,
    @Req() req: CustomRequest,
    @Res() res: Response,
  ) {
    try {
      const { id } = req.user;
      const comment = await this.commentService.createComment(
        createCommentDto,
        id,
      );
      res.status(201).json({
        success: true,
        comment: comment,
      });
    } catch (err) {
      res.status(400).json({
        success: false,
        message: err.message,
      });
    }
  }

  @Get(':videoId')
  async findAll(@Param('videoId') videoId: string, @Res() res: Response) {
    try {
      const comments =
        await this.commentService.getAllCommentsOnAVideo(videoId);
      res.status(201).json({
        success: true,
        comments: comments,
      });
    } catch (err) {
      res.status(400).json({
        success: false,
        message: err.message,
      });
    }
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.commentService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCommentDto: UpdateCommentDto) {
    return this.commentService.update(+id, updateCommentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.commentService.remove(+id);
  }
}
