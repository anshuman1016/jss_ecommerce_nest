import { Injectable } from '@nestjs/common';
import { CreateBlockedUserDto } from './dto/create-blocked-user.dto';
import { BlockedUserEntity } from './entities/blocked-user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';
import { UserEntity } from 'src/users/entities/user.entity';

@Injectable()
export class BlockedUsersService {
  constructor(
    @InjectRepository(BlockedUserEntity)
    private blockedRepository: Repository<BlockedUserEntity>,
    private readonly userService: UsersService,
  ) {}
  get BlockRepository(): Repository<BlockedUserEntity> {
    return this.blockedRepository;
  }

  async create(userId: number, createBlockedUserDto: CreateBlockedUserDto) {
    const { id } = createBlockedUserDto;
    const blocked = this.blockedRepository.create({
      blocked_by: userId,
      blocked_user: id,
    });
    const blocked_users_data = await this.blockedRepository.save(blocked);
    const user = await this.userService.UserRepository.findOne({
      where: { id: userId },
    });
    let updatedBlockedUsers;
    if (user.blocked_users) {
      updatedBlockedUsers = [...user.blocked_users, id];
    } else {
      updatedBlockedUsers = [id];
    }
    await this.userService.UserRepository.update(userId, {
      blocked_users: updatedBlockedUsers,
    });
    return blocked_users_data;
  }

  async unBlockUser(userId: number, user: UserEntity) {
    const unblocked = await this.blockedRepository.delete({
      blocked_by: user.id,
      blocked_user: userId,
    });
    const userIdString = userId.toString();
    const blockedUsersAsString = user.blocked_users.map(String);

    const unblockIds = blockedUsersAsString.filter((unblockUserId) => {
      return unblockUserId !== userIdString;
    });
    const unblockIdsAsNumbers = unblockIds.map(Number);
    await this.userService.UserRepository.update(user.id, {
      ...user,
      blocked_users: unblockIdsAsNumbers,
    });
    return unblocked;
  }
}
