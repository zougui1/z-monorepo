import { NestFactory } from '@nestjs/core';
import type { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

import config from '@zougui/common.config/node';
import { listenNestApp } from '@zougui/common.api-server-utils';
import { connect } from '@zougui/auth.database';

import { AppModule } from './app.module';

async function bootstrap() {
  await connect();
  const app = await NestFactory.create(AppModule, {
    cors: config.auth.apiServer.cors as CorsOptions,
  });

  await listenNestApp(app, config.auth.apiServer.port);
}
bootstrap();
