import {
  Body,
  Controller,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { EmailDto } from './dto/email.dto';
import { LoginDto } from './dto/login.dto';
import { AuthService } from './auth.service';
import { ConfirmRegisterDto } from './dto/confirm-register.dto';
import { RestorePasswordDto } from './dto/restore-password.dto';
import { Auth } from '~common/decorators/auth.decorator';
import { RestoreEmailDto } from './dto/restore-email.dto';
import { GetUser } from '~common/decorators/get-user.decorator';
import { User } from '~modules/users/user.entity';

interface IToken {
  accessToken: string;
}

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) {}

  @Post('register')
  register(@Body() data: EmailDto): Promise<void> {
    return this.authService.register({ dto: data });
  }

  @Post('register/confirm')
  registerConfirm(@Body() data: ConfirmRegisterDto): Promise<IToken> {
    return this.authService.registerConfirm({ dto: data });
  }

  @Post('login')
  login(@Body() data: LoginDto): Promise<IToken> {
    return this.authService.login({ dto: data });
  }

  @Patch('password/reset')
  resetPassword(@Body() data: EmailDto): Promise<void> {
    return this.authService.resetPassword({ dto: data });
  }

  @Put('password/restore')
  restorePassword(@Body() data: RestorePasswordDto): Promise<void> {
    return this.authService.restorePassword({ dto: data });
  }

  @Auth()
  @Patch('email/reset')
  resetEmail(
    @Body() dto: EmailDto,
  ): Promise<void> {
    return this.authService.resetEmail({ dto });
  }

  @Auth()
  @Put('email/restore')
  restoreEmail(
    @Body() dto: RestoreEmailDto,
    @GetUser() user: User,
  ): Promise<void> {
    return this.authService.restoreEmail({ dto, user });
  }
}
