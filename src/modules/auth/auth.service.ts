import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import * as moment from 'moment';
import { v4 as uuid } from 'uuid';
import { MoreThanOrEqual } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';

import { User } from '~modules/users/user.entity';
import { Token } from '~modules/tokens/token.entity';
import { LoggerService } from '~core/logger/logger.service';
import { UserRoleEnum } from '~modules/users/enums/user-role.enum';
import { UsersRepository } from '~modules/users/users.repository';
import { TokensTypeEnum } from '~modules/tokens/enums/tokens-type.enum';
import { TokensRepository } from '~modules/tokens/tokens.repository';
import { TokensStatusEnum } from '~modules/tokens/enums/tokens-status.enum';

import { AuthUtil } from './auth.util';
import { LoginDto } from './dto/login.dto';
import { EmailDto } from './dto/email.dto';
import { ConfirmRegisterDto } from './dto/confirm-register.dto';
import { RestorePasswordDto } from './dto/restore-password.dto';
import { RestoreEmailDto } from './dto/restore-email.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly authUtil: AuthUtil,
    private readonly loggerService: LoggerService,
    private readonly usersRepository: UsersRepository,
    private readonly tokensRepository: TokensRepository,
    private readonly eventEmitter: EventEmitter2,
  ) {
    this.loggerService.setContext(AuthService.name);
  }

  async register({ dto }: IEmail): Promise<void> {
    let tokenExist: number;
    try {
      tokenExist = await this.tokensRepository.count({
        where: {
          email: dto.email,
          status: TokensStatusEnum.NEW,
          type: TokensTypeEnum.EMAIL,
        },
      });
    } catch (error) {
      const message = 'Failed to find token';
      this.loggerService.error(message, error);
      throw new InternalServerErrorException(message);
    }

    if (tokenExist) {
      const message = 'User already exist';
      throw new BadRequestException(message);
    }

    const tokenPayload: Partial<Token> = {
      token: uuid(),
      email: dto.email,
      type: TokensTypeEnum.EMAIL,
      expireAt: moment().add(24, 'hour').toDate(),
    };

    let token: Token;
    try {
      token = await this.tokensRepository.create(tokenPayload).save();
    } catch (error) {
      const message = 'Failed to save token';
      this.loggerService.error(message, error);
      throw new InternalServerErrorException(message);
    }

    // senging mail
    this.eventEmitter.emit('owner.register', token);

    this.loggerService.log(`New owner wants to register ${dto.email}`);
  }

  async registerConfirm({ dto }: IConfirmRegister): Promise<IToken> {
    const tokensFilter = {
      token: dto.token,
      type: TokensTypeEnum.EMAIL,
      expireAt: MoreThanOrEqual(moment().toDate()),
      status: TokensStatusEnum.NEW,
    };

    let tokenExist: Token;
    try {
      tokenExist = await this.tokensRepository.findOne({ where: tokensFilter });
    } catch (error) {
      const message = 'Failed to find token';
      this.loggerService.error(message, error);
      throw new InternalServerErrorException(message);
    }

    if (!tokenExist) {
      const message = 'Token not found';
      this.loggerService.error(message);
      throw new NotFoundException(message);
    }

    try {
      await this.tokensRepository.update(tokensFilter, {
        status: TokensStatusEnum.COMPLETE,
      });
    } catch (error) {
      const message = 'Failed to update token';
      this.loggerService.error(message, error);
    }

    const hashedPassword = await this.authUtil.hashPassword(dto.password);

    const userPayload: Partial<User> = {
      email: tokenExist.email,
      role: UserRoleEnum.OWNER,
      ...dto,
      password: hashedPassword,
    };

    let user: User;
    try {
      user = await this.usersRepository.create(userPayload).save();
    } catch (error) {
      const message = 'Failed to create user';
      this.loggerService.error(message, error);
      throw new InternalServerErrorException(message);
    }

    this.loggerService.log(`User ${tokenExist.email} registered`);

    const authPayload = {
      id: user.id,
    };

    return { accessToken: this.authUtil.signToken(authPayload) };
  }

  async login({ dto }: ILogin): Promise<IToken> {
    let user: User;
    try {
      user = await this.usersRepository.findOne({
        where: [
          {
            email: dto.email,
          }, {
            phoneNumber: dto.phone,
          }],
      });
    } catch (error) {
      const message = 'Failed to find user';
      this.loggerService.error(message, error);
      throw new InternalServerErrorException(message);
    }

    if (!user) {
      const message = 'Invalid credentials';
      throw new BadRequestException(message);
    }

    let passValid: boolean;
    try {
      passValid = await this.authUtil.comparePassword(dto.password, user.password);
    } catch (error) {
      const message = 'Failed to validate password';
      this.loggerService.error(message, error);
      throw new InternalServerErrorException(message);
    }

    if (!passValid) {
      const message = 'Invalid credentials';
      throw new BadRequestException(message);
    }

    const authPayload = {
      id: user.id,
    };

    return { accessToken: this.authUtil.signToken(authPayload) };
  }

  async resetPassword({ dto }: IEmail): Promise<void> {
    let userExist: User;
    try {
      userExist = await this.usersRepository.findOne({
        email: dto.email,
      });
    } catch (error) {
      const message = `Failed to find user ${dto.email}`;
      this.loggerService.error(message, error);
      throw new InternalServerErrorException(message);
    }

    if (!userExist) {
      const message = `User ${dto.email} not found`;
      this.loggerService.error(message);
      throw new NotFoundException(message);
    }

    const tokensPayload: Partial<Token> = {
      email: userExist.email,
      token: uuid(),
      expireAt: moment().add(24, 'hours').toDate(),
      type: TokensTypeEnum.PASSWORD,
    };

    let token: Token;
    try {
      token = await this.tokensRepository.create(tokensPayload).save();
    } catch (error) {
      const message = 'Failed to save token';
      this.loggerService.error(message, error);
      throw new InternalServerErrorException(message);
    }

    // senging mail
    this.eventEmitter.emit('password.reset', token);
  }

  async restorePassword({ dto }: IRestorePassword): Promise<void> {
    const tokensFilter = {
      token: dto.token,
      type: TokensTypeEnum.PASSWORD,
      status: TokensStatusEnum.NEW,
      expireAt: MoreThanOrEqual(moment().toDate()),
    };

    let tokenExist: Token;
    try {
      tokenExist = await this.tokensRepository.findOne(tokensFilter);
    } catch (error) {
      const message = 'Failed to find token';
      this.loggerService.error(message, error);
      throw new InternalServerErrorException(message);
    }

    if (!tokenExist) {
      const message = `Token ${dto.token} not found`;
      this.loggerService.error(message);
      throw new NotFoundException(message);
    }

    try {
      await this.tokensRepository.update(tokensFilter, {
        status: TokensStatusEnum.COMPLETE,
      });
    } catch (error) {
      const message = 'Failed to update token';
      this.loggerService.error(message, error);
      throw new InternalServerErrorException(message);
    }

    let hashedPassword: string;
    try {
      hashedPassword = await this.authUtil.hashPassword(dto.password);
    } catch (error) {
      const message = 'Failed to hash password';
      this.loggerService.error(message, error);
      throw new InternalServerErrorException(message);
    }

    try {
      await this.usersRepository.update({
        email: tokenExist.email,
      }, {
        password: hashedPassword,
      });
    } catch (error) {
      const message = 'Failed to update user';
      this.loggerService.error(message, error);
      throw new InternalServerErrorException(message);
    }
  }

  async resetEmail({ dto }: IResetEmail): Promise<void> {
    let emailUsed: number;

    try {
      emailUsed = await this.usersRepository.count({ email: dto.email });
    } catch (error) {
      const message = 'Failed to find email';
      this.loggerService.error(message, error);
      throw new InternalServerErrorException(message);
    }

    if (emailUsed) {
      const message = 'Email already in use';
      throw new BadRequestException(message);
    }

    let tokenExist: number;
    try {
      tokenExist = await this.tokensRepository.count({
        where: {
          email: dto.email,
          status: TokensStatusEnum.NEW,
          type: TokensTypeEnum.EMAIL,
        },
      });
    } catch (error) {
      const message = 'Failed to find token';
      this.loggerService.error(message, error);
      throw new InternalServerErrorException(message);
    }

    if (tokenExist) {
      const message = 'Email is been used';
      throw new BadRequestException(message);
    }

    const tokenPayload: Partial<Token> = {
      token: uuid(),
      email: dto.email,
      type: TokensTypeEnum.EMAIL,
      expireAt: moment().add(24, 'hour').toDate(),
    };

    let token: Token;
    try {
      token = await this.tokensRepository.create(tokenPayload).save();
    } catch (error) {
      const message = 'Failed to save confirmToken';
      this.loggerService.error(message, error);
      throw new InternalServerErrorException(message);
    }

    this.eventEmitter.emit('email.reset', token);
  }

  async restoreEmail({ dto, user }: IRestoreEmail): Promise<void> {
    const tokensFilter = {
      token: dto.token,
      type: TokensTypeEnum.EMAIL,
      status: TokensStatusEnum.NEW,
      expireAt: MoreThanOrEqual(moment().toDate()),
    };

    let tokenExist: Token;
    try {
      tokenExist = await this.tokensRepository.findOne(tokensFilter);
    } catch (error) {
      const message = 'Failed to find token';
      this.loggerService.error(message, error);
      throw new InternalServerErrorException(message);
    }

    if (!tokenExist) {
      const message = `Token ${dto.token} not found`;
      this.loggerService.error(message);
      throw new NotFoundException(message);
    }

    try {
      await this.tokensRepository.update(tokensFilter, {
        status: TokensStatusEnum.COMPLETE,
      });
    } catch (error) {
      const message = 'Failed to update confirm token';
      this.loggerService.error(message, error);
      throw new InternalServerErrorException(message);
    }

    try {
      await this.usersRepository.update({
        email: user.email,
      }, {
        email: tokenExist.email,
      });
    } catch (error) {
      const message = 'Failed to update user';
      this.loggerService.error(message, error);
      throw new InternalServerErrorException(message);
    }
  }
}

interface IEmail {
  dto: EmailDto,
}

interface IToken {
  accessToken: string,
}

interface IConfirmRegister {
  dto: ConfirmRegisterDto,
}

interface ILogin {
  dto: LoginDto,
}

interface IRestorePassword {
  dto: RestorePasswordDto,
}

interface IResetEmail {
  dto: EmailDto,
}

interface IRestoreEmail {
  dto: RestoreEmailDto,
  user: User,
}
