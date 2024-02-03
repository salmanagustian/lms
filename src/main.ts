import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import * as qs from 'qs';
import { install } from 'source-map-support';
import { satisfies } from 'semver';
import { Logger, ValidationPipe, VersioningType } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { engines } from '../package.json';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  install();
  
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter({
    querystringParser: (str: string) => qs.parse(str),
  }));

  app.enableVersioning({
    type: VersioningType.URI,
  });

  app.setGlobalPrefix('api');

  app.useGlobalPipes(new ValidationPipe());

  const config = new DocumentBuilder()
    .setTitle('LMS')
    .setDescription('Loyalty backend service for techical test')
    .setVersion('1.0')
    .addBearerAuth({
      // I was also testing it without prefix 'Bearer ' before the JWT
      description: '[just text field] Please enter token in following format: Bearer <JWT>',
      name: 'Authorization',
      bearerFormat: 'Bearer', // I`ve tested not to use this field, but the result was the same
      scheme: 'Bearer',
      type: 'http', // I`ve attempted type: 'apiKey' too
      in: 'Header',
    })
    .build();
  const document = SwaggerModule.createDocument(app, config, {
    include: [],
    deepScanRoutes: true,
  });
  SwaggerModule.setup('api/docs', app, document);

  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: '*',
    credentials: false,
  });

  const version = engines.node;
  if (!satisfies(process.version, version)) {
    console.log(`Required node version ${version} not satisfied with current version ${process.version}.`);
    process.exit(1);
  }

  const configService = app.get(ConfigService);
  const appPort = configService.get<number>('app.port');
  await app.listen(appPort || 3000, '0.0.0.0');
  new Logger().log(`Your Application run in ${await app.getUrl()}`, 'Nest Application');
}
bootstrap();
