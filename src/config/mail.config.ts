import { registerAs } from '@nestjs/config';

export default registerAs('mail', () => ({
  host: process.env.MAIL_HOST || 'smtp.gmail.com',
  user: process.env.MAIL_USER || 'test@gmail.com',
  password: process.env.MAIL_PASSWORD || 'test',
  from: process.env.MAIL_FROM || 'test@gmail.com',
  transport: process.env.MAIL_TRANSPORT || 'smtp://test@gmail.com:test@smtp.gmail.com',
}));
