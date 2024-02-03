import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import config from './config';
import schema from './schema';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [config],
      expandVariables: true,
      validationSchema: schema,
    }),
  ],
})
export class AuthConfigModule {}
