import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SequelizeModuleOptions, SequelizeOptionsFactory } from '@nestjs/sequelize';
import { configMapping } from './config';

@Injectable()
export class SequelizeConfigService implements SequelizeOptionsFactory {
  constructor(
    private readonly configService: ConfigService,
  ) {

  }

  createSequelizeOptions(): SequelizeModuleOptions {
    const dbConfig = this.configService.getOrThrow('database');
    return configMapping(dbConfig);
  }
}
