/* eslint-disable @typescript-eslint/no-unsafe-assignment */
const { version } = module.require('../../package.json');

const env = process.env.NODE_ENV || 'development';
const isDev = env === 'development';

export default () => ({
  env,
  isDev,
  version,

  name: process.env.SERVER_NAME || 'Nest-Typeorm template Api',
  host: process.env.SERVER_HOST || 'https://host.com',
  mount: process.env.SERVER_MOUNT || '/api',
  port: parseInt(process.env.SERVER_PORT) || 8085,
  uiDevHost: process.env.UI_DEV_HOST || 'http://localhost:8080',
});
