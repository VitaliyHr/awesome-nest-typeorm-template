import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

import { LoggerService } from '~core/logger/logger.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ModifyUserDto } from './dto/modify-user.dto';

import { User } from './user.entity';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(
    private loggerService: LoggerService,
    private usersRepository: UsersRepository,
  ) {
    this.loggerService.setContext(UsersService.name);
  }

  async create({ dto }: IUserCreate) {
    let user: User;

    try {
      user = await this.usersRepository.findOne({ where: { email: dto.email } });
    } catch (error) {
      const message = 'Failed to find user by email property';
      throw new InternalServerErrorException(message);
    }

    if (user) {
      const message = 'User already exists';
      throw new ConflictException(message);
    }

    try {
      user = await this.usersRepository.create(dto).save();
    } catch (error) {
      const message = 'Failed to create user';
      this.loggerService.error(error, message);
      throw new InternalServerErrorException(message);
    }

    return user;
  }

  async list() {
    let users: User[];

    try {
      users = await this.usersRepository.find();
    } catch (error) {
      const message = 'Failed to find all users';
      this.loggerService.error(error, message);
      throw new InternalServerErrorException(message);
    }

    return users;
  }

  async get({ userId }: IUserGet) {
    let user: User;

    try {
      user = await this.usersRepository.findOne(userId);
    } catch (error) {
      const message = 'Failed to find one user';
      this.loggerService.error(error, message);
      throw new InternalServerErrorException(message);
    }

    if (!user) {
      const message = 'Could not found user';
      throw new NotFoundException(message);
    }

    return user;
  }

  async modify({ userId, dto }: IUserModify) {
    let user: User;

    try {
      user = await this.usersRepository.findOne(userId);
    } catch (error) {
      const message = 'Failed to find user';
      throw new InternalServerErrorException(message);
    }

    if (!user) {
      const message = 'Could not found user to modify';
      throw new NotFoundException(message);
    }

    Object.assign(user, dto);

    try {
      user = await this.usersRepository.save(user);
    } catch (error) {
      const message = 'Failed to find user';
      throw new InternalServerErrorException(message);
    }

    return user;
  }

  async delete({ userId }: IUserDelete) {
    let user: User;

    try {
      user = await this.usersRepository.findOne(userId);
    } catch (error) {
      const message = '';
      throw new InternalServerErrorException(message);
    }

    if (!user) {
      const message = '';
      throw new NotFoundException(message);
    }

    try {
      await this.usersRepository.softDelete(user);
    } catch (error) {
      const message = '';
      throw new InternalServerErrorException(message);
    }

    return user;
  }
}

interface IUserCreate {
  dto: CreateUserDto;
}

interface IUserGet {
  userId: string;
}

interface IUserModify {
  userId: string;
  dto: ModifyUserDto;
}

interface IUserDelete {
  userId: string;
}
