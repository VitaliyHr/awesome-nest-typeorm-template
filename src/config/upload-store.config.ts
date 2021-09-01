import { registerAs } from '@nestjs/config';

export default registerAs('uploadStore', () => ({
  url: process.env.UPLOAD_STORE_URL || 'http://localhost:8998',
  mount: process.env.UPLOAD_STORE_MOUNT || '/image',
  method: {
    create: process.env.UPLOAD_STORE_METHOD_CREATE || 'POST',
    update: process.env.UPLOAD_STORE_METHOD_UPDATE || 'PUT',
    delete: process.env.UPLOAD_STORE_METHOD_DELETE || 'DELETE',
  },

  delete: {
    attempts: parseInt(process.env.UPLOAD_STORE_DELETE_ATTEMPTS) || 5,
  },
}));
