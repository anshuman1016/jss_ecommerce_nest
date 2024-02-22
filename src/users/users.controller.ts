import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  ValidationPipe,
  BadRequestException,
  UseGuards,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Response } from 'express';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateLoginDto } from './dto/create-login.dto';
import { UsersService } from './users.service';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('/user')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Post('create/role')
  async createRole(
    @Body(new ValidationPipe()) body: string,
    @Res() res: Response,
  ) {
    try {
      const addedRole = await this.userService.createRoleOfUser(body);
      return res.status(201).json({
        success: true,
        message: 'User created successfully',
        result: addedRole,
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: err,
      });
    }
  }

  @Post('create')
  async create(
    @Body(new ValidationPipe()) createUserDto: CreateUserDto,
    @Res() res: Response,
  ) {
    try {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(createUserDto.password, salt);
      createUserDto.password = hashedPassword;
      const addedUser = await this.userService.createUser(createUserDto);

      return res.status(201).json({
        success: true,
        message: 'User created successfully',
        result: addedUser,
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  }

  @Post('/signin')
  async loginUser(
    @Body() createLogionDto: CreateLoginDto,
    @Res() res: Response,
  ) {
    try {
      const result = await this.userService.login(createLogionDto);

      return res.status(200).json({
        success: true,
        message: 'User logged in',
        result: result,
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  }

  @Post('/forgot-password')
  async forgotPassword(
    @Body() createUserDto: CreateUserDto,
    @Res() res: Response,
  ) {
    try {
      const user = await this.userService.UserRepository.findOne({
        where: { email: createUserDto.email },
      });
      console.log(user);

      if (user) {
        const resetToken = await this.userService.generateResetToken(
          createUserDto.email,
        );
        await this.userService.sendResetEmail(createUserDto.email, resetToken);

        return res.status(200).json({
          success: true,
          message: 'Password reset link sent to email',
        });
      } else {
        return res.status(404).json({
          success: false,
          message: 'User not found',
        });
      }
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error,
      });
    }
  }

  @Post('/reset-password/:token')
  async reset(
    @Param('token') token: string,
    @Body() createUserDto: { password: string; confirmPassword: string },
    @Res() res: Response,
  ) {
    try {
      if (createUserDto.password !== createUserDto.confirmPassword) {
        throw new BadRequestException('Passwords do not match');
      }

      const { email } = this.userService.verifyResetToken(token);
      const a = this.userService.verifyResetToken(token);
      console.log('Controller Reset email', email);
      console.log('Controller Reset email a', a);

      await this.userService.resetPassword(email, createUserDto.password);

      return res.status(200).json({
        success: true,
        message: 'Password reset successful',
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error,
      });
    }
  }

  @Get('/all-users')
  @UseGuards(AuthGuard)
  findAll() {
    return this.userService.findAll();
  }

  @Get('/data/:id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Patch('/update/:id')
  async updateUser(
    @Res() res: Response,
    @Param('id') id: number,
    @Body(new ValidationPipe()) updateUserDto: UpdateUserDto,
  ) {
    try {
      if (updateUserDto.password) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(updateUserDto.password, salt);
        updateUserDto.password = hashedPassword;
      }
      const result = await this.userService.updateUser(id, updateUserDto);
      return res.status(200).json({
        success: true,
        message: 'User update successfully',
        data: result,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error,
      });
    }
  }

  @Delete('/delete/:id')
  async remove(@Param('id') id: string, @Res() res: Response) {
    try {
      await this.userService.removeUser(+id);
      return res.status(200).json({
        success: true,
        message: 'User deleted successfully',
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: err,
      });
    }
  }
}
