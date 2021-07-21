import { registerAs } from '@nestjs/config';

export default registerAs('auth', () => ({
  secret: process.env.AUTH_SECRET || 'secret',
  salt: parseInt(process.env.AUTH_SALT) || 10,
  expire: process.env.AUTH_EXPIRE || '24h',
}));
