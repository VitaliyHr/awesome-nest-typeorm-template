import { registerAs } from '@nestjs/config';

export default registerAs('thumbor', () => ({
  url: process.env.THUMBOR_URL || 'http://localhost:8998/image',

  create: {
    method: process.env.THUMBOR_CREATE_METHOD || 'POST',
  },

  update: {
    method: process.env.THUMBOR_UPDATE_METHOD || 'PUT',
  },

  delete: {
    method: process.env.THUMBOR_DELETE_METHOD || 'DELETE',
    attempts: parseInt(process.env.THUMBOR_DELETE_ATTEMPTS) || 5,
  },
}));
