import { registerAs } from '@nestjs/config';

export default registerAs('http', () => ({
  responseType: process.env.HTTP_RESPONSE_TYPE || 'json',
  maxRedirects: parseInt(process.env.HTTP_MAX_REDIRECTS) || 5,
  timeout: parseInt(process.env.HTTP_TIMEOUT) || 1000,
  decompress: process.env.HTTP_DECOMPRESS || true,
  maxBodyLength: parseInt(process.env.HTTP_MAX_BODY_LENGTH) || 2000,
  maxContentLength: parseInt(process.env.HTTP_MAX_CONTENT_LENGTH) || 2000,
}));
