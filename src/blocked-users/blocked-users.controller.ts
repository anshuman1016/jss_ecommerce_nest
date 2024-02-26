import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  Res,
  Put,
  Param,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { BlockedUsersService } from './blocked-users.service';
import { CreateBlockedUserDto } from './dto/create-blocked-user.dto';
import { Roles } from 'src/decorators/roles.decorators';
import { AuthGuard } from 'src/auth/auth.guard';
import { AuthorizationGuard } from 'src/auth/authorization.guard';
import { UsersService } from 'src/users/users.service';

interface CustomRequest extends Request {
  user: { id: number; email: string };
}

@Controller('users')
export class BlockedUsersController {
  constructor(
    private readonly blockedUsersService: BlockedUsersService,
    private readonly userService: UsersService,
  ) {}

  @Roles(['ADMIN', 'USER'])
  @UseGuards(AuthGuard, AuthorizationGuard)
  @Post('block')
  async create(
    @Body() createBlockedUserDto: CreateBlockedUserDto,
    @Req() req: CustomRequest,
    @Res() res: Response,
  ) {
    try {
      const { email } = req.user;
      const findUser = await this.userService.UserRepository.findOne({
        where: { email: email },
      });
      const blockUserExist = await this.userService.UserRepository.findOne({
        where: { id: createBlockedUserDto.id },
      });
      if (!blockUserExist) {
        throw new Error('User does not exist!');
      }
      await this.blockedUsersService.create(findUser.id, createBlockedUserDto);
      res.status(201).json({
        success: true,
        message: 'User blocked successfully!',
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
  @Put('/unblockUser/:userId')
  async unBlock(
    @Param('userId') userId: number,
    @Req() req: CustomRequest,
    @Res() res: Response,
  ) {
    try {
      const { email } = req.user;
      const user = await this.userService.UserRepository.findOne({
        where: { email: email },
      });
      const userToUnblockExist = await this.userService.UserRepository.findOne({
        where: { id: userId },
      });
      if (!userToUnblockExist) {
        throw new Error('User does not exist!');
      }
      await this.blockedUsersService.unBlockUser(+userId, user);
      res.status(200).json({
        success: true,
        message: 'User unblocked successfully!',
      });
    } catch (err) {
      res.status(400).json({
        success: false,
        message: err.message,
      });
    }
  }
}
