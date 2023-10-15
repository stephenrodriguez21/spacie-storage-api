import { registerAs } from '@nestjs/config';

export default registerAs('auth', () => ({
  secret: process.env.AUTH_JWT_SECRET,
  expires: process.env.AUTH_JWT_TOKEN_EXPIRES_IN,
  refreshSecret: process.env.REFRESH_JWT_SECRET,
  refreshExpires: process.env.REFRESH_JWT_TOKEN_EXPIRES_IN,
}));
