import { ConfigModule } from '@nestjs/config';

import appConf from '../../config/app.config';
import authConf from '../../config/auth.config';
import mailConf from '../../config/mail.config';
import httpConf from '../../config/http.config';
import thumborConf from '../../config/thumbor.config';
import databaseConf from '../../config/database.config';

export default ConfigModule.forRoot({
  envFilePath: '.env',
  load: [
    appConf,
    databaseConf,
    authConf,
    mailConf,
    thumborConf,
    httpConf,
  ],
  encoding: 'UTF-8',
});
