import * as path from 'path';

export default () => ({
  host: process.env.HOST_MAIL,
  port: parseInt(process.env.PORT_MAIL || '0'),
  user: process.env.USER_MAIL,
  pass: process.env.PASS_MAIL,
  jwt: process.env.JWT_SECRET,
  mongodb: process.env.MONGO_URL || process.env.MONGO_URL_LOCAL,
});

export const file = path.resolve(
  __dirname,
  process.env.NODE_ENV === 'dev' ? '../../uploads' : '../../../uploads',
);
