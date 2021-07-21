import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { UsersModule } from '~modules/users/users.module';
import { TokensModule } from '~modules/tokens/tokens.module';

import { AuthUtil } from './auth.util';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { RolesGuard } from './guards/user-role.guard';
import { JwtStrategy } from './strategies/jwt.strategy';

const JwtDynamic = JwtModule.registerAsync({
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => ({
    secret: configService.get('auth.secret'),
    signOptions: {
      expiresIn: configService.get('auth.expire'),
    },
  }),
});

@Module({
  imports: [
    PassportModule,
    JwtDynamic,
    UsersModule,
    TokensModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    AuthUtil,
    JwtStrategy,
    RolesGuard,
  ],
  exports: [
    AuthUtil,
    RolesGuard,
  ],
})
export class AuthModule {}
