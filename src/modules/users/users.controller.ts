import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { CreateUserDto } from './dto/create-user.dto';
import { ModifyUserDto } from './dto/modify-user.dto';
import { UsersService } from './users.service';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(
    private usersService: UsersService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  userCreate(
    @Body() dto: CreateUserDto,
  ) {
    return this.usersService.create({ dto });
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  userList() {
    return this.usersService.list();
  }

  @Get(':userId')
  @HttpCode(HttpStatus.OK)
  userGet(
    @Param('userId') userId: string,
  ) {
    return this.usersService.get({ userId });
  }

  @Patch(':userId')
  @HttpCode(HttpStatus.OK)
  userModify(
    @Param('userId') userId: string,
    @Body() dto: ModifyUserDto,
  ) {
    return this.usersService.modify({ userId, dto });
  }
}
