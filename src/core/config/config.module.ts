import { ConfigModule } from '@nestjs/config';

import appConf from '../../config/app.config';
import authConf from '../../config/auth.config';
import mailConf from '../../config/mail.config';
import httpConf from '../../config/http.config';
import uploadStoreConf from '../../config/upload-store.config';
import databaseConf from '../../config/database.config';

export default ConfigModule.forRoot({
  envFilePath: '.env',
  load: [
    appConf,
    databaseConf,
    authConf,
    mailConf,
    uploadStoreConf,
    httpConf,
  ],
  encoding: 'UTF-8',
});
