import { Module } from '@nestjs/common';

import { CoreModule } from '~core/core.module';
import { AuthModule } from '~modules/auth/auth.module';
import { UploadsModule } from '~modules/uploads/uploads.module';
import { UsersModule } from '~modules/users/users.module';

@Module({
  imports: [
    CoreModule,
    AuthModule,
    UploadsModule,
    UsersModule,
  ],
})
export class AppModule {}
