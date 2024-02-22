import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import * as nodemailer from 'nodemailer';
import { Injectable } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UserEntity } from './entities/user.entity';
import { CreateLoginDto } from './dto/create-login.dto';
import { RoleEntity } from './entities/role.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(RoleEntity)
    private roleRepository: Repository<RoleEntity>,
  ) {}

  get UserRepository(): Repository<UserEntity> {
    return this.userRepository;
  }

  async createRoleOfUser(body) {
    const createdRole = this.roleRepository.create(body);
    const userRole = await this.roleRepository.save(createdRole);
    return userRole;
  }

  async createUser(createUserDto: CreateUserDto) {
    const existingUser = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });
    if (existingUser) {
      console.log('yes');
      throw new Error('User already exist with this email');
    } else {
      const createdUser = this.userRepository.create(createUserDto);
      const userData = await this.userRepository.save(createdUser);
      delete userData.password;
      return userData;
    }
  }

  async login(createLogionDto: CreateLoginDto) {
    const findUser = await this.userRepository.findOne({
      where: { email: createLogionDto.email },
    });

    if (findUser) {
      const { password } = findUser;
      const checkPassword = await bcrypt.compare(
        createLogionDto.password,
        password,
      );
      if (checkPassword) {
        const payload = {
          id: findUser.id,
          email: createLogionDto.email,
          role: findUser.role,
        };
        const token = jwt.sign(payload, process.env.JWT_SECRET_KEY);
        return { token };
      } else {
        throw new Error('Incorrect email or password');
      }
    } else {
      throw new Error('User not found');
    }
  }

  generateResetToken(email: string): string {
    const payload = { email };
    console.log('RESET_SECRET_KEY:', process.env.RESET_SECRET_KEY);
    return jwt.sign(payload, process.env.RESET_SECRET_KEY, { expiresIn: '5m' });
  }

  verifyResetToken(token: string): { email: string } {
    console.log('RESET_SECRET_KEY:', process.env.RESET_SECRET_KEY);
    return jwt.verify(token, process.env.RESET_SECRET_KEY) as { email: string };
  }

  async sendResetEmail(email: string, token: string): Promise<void> {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: '',
        pass: '',
      },
    });

    const mailOptions = {
      from: '',
      to: email,
      subject: 'Password Reset',
      html: `<p>Click the following link to reset your password:</p>
             <a href="http://your-app-url/reset-password/${token}">Reset Password</a>`,
    };

    await transporter.sendMail(mailOptions);
  }

  // Reset password
  async resetPassword(email: string, newPassword: string): Promise<void> {
    const user = await this.userRepository.findOne({ where: { email } });

    if (user) {
      // Update the user's password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);
      user.password = hashedPassword;

      // Save the updated user
      await this.userRepository.save(user);
    } else {
      throw new Error('User not found');
    }
  }

  findAll() {
    return this.userRepository.find();
  }

  findOne(id: number) {
    return this.userRepository.findOneBy({ id });
  }

  async updateUser(id: number, updateUserDto: UpdateUserDto) {
    try {
      const existingUser = await this.userRepository.findOneBy({ id });
      if (!existingUser) {
        throw new Error('User not found');
      }
      Object.assign(existingUser, updateUserDto);
      const userData = await this.userRepository.save(existingUser);
      return userData;
    } catch (err) {
      throw new Error(`Failed to update user: ${err}`);
    }
  }

  async removeUser(id: number) {
    try {
      const toDelete = await this.userRepository.findOneBy({ id });
      console.log(toDelete);

      if (!toDelete) {
        throw new Error('User not found');
      }

      const deletedData = await this.userRepository.remove(toDelete);
      console.log(deletedData);

      // return deletedData;
    } catch (err) {
      throw new Error(`${err}`);
    }
  }
}
