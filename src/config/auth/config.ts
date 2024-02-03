import { registerAs } from '@nestjs/config';
export default registerAs('auth', () => ({
  JWT_ALGORITHM: process.env.JWT_ALGORITHM,
  JWT_SECRET: process.env.JWT_SECRET,
}));
