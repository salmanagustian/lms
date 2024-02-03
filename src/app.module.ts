import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { CONFIG_MODULES } from 'app.provider';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ...CONFIG_MODULES,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
