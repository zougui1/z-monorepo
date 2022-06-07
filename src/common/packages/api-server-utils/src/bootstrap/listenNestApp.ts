import cookieParser from 'cookie-parser';
import type { INestApplication } from '@nestjs/common/interfaces/nest-application.interface';

import config, { watchForConfigChanges } from '@zougui/common.config/node';

import { displayServerUrl } from '../utils';
import { LoggingInterceptor } from '../interceptors';

export const listenNestApp = async (app: INestApplication, port: number): Promise<void> => {
  // copy is required as the secrets are marked as readonly
  app.use(cookieParser([...config.auth.session.secrets]));
  app.useGlobalInterceptors(new LoggingInterceptor());

  const listen = (): Promise<void> => {
    return app.listen(port, () => displayServerUrl(port));
  }

  await listen();

  watchForConfigChanges(async path => {
    console.log(`update config ${path}`);
    await app.close();
    await listen();
  });
}
