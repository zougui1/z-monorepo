import path from 'node:path';

import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';
import spdy, { ServerOptions } from 'spdy';
import fs from 'fs-extra';

import config from '@zougui/common.config/node';
import { connect } from '@zougui/image-downloader.database';

import { AppModule } from './app.module';

async function bootstrap() {
  await connect();

  /*const certDir = path.join(__dirname, '../cert');

  const spdyOptions: ServerOptions = {
    key: fs.readFileSync(path.join(certDir, 'server.key')),
    cert: fs.readFileSync(path.join(certDir, 'server.cert')),
  };

  const expressApp = express();
  const server = spdy.createServer(spdyOptions, expressApp);

  const app = await NestFactory.create(AppModule, new ExpressAdapter(expressApp), { cors: true });
  await app.init();
  server.listen(config.media.apiServer.port);*/

  const app = await NestFactory.create(AppModule, { cors: true });
  await app.listen(config.media.apiServer.port);
}
bootstrap();
