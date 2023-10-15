import { registerAs } from '@nestjs/config';

export default registerAs('apple', () => ({
  appAudience: "",
}));
