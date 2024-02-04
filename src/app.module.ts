import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { CONFIG_MODULES } from 'app.provider';
import { AuthModule } from 'modules/auth/auth.module';
import { TierModule } from 'modules/tiers/tiers.module';
import { ClsModule } from 'nestjs-cls';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ClsModule.forRoot({
      global: true,
    }),
    ...CONFIG_MODULES,
    AuthModule,
    TierModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
