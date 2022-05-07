import { NestFactory } from '@nestjs/core';

import { connect } from '@zougui/log.database';

import { AppModule } from './app.module';
import { port } from './constants';

async function bootstrap() {
  await connect();
  const app = await NestFactory.create(AppModule, { cors: true });
  await app.listen(port);
}
bootstrap();
