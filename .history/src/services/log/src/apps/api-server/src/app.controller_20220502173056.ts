import fs from 'fs/promises';

import { Controller, Get } from '@nestjs/common';

import { connect, logQueries } from '@zougui/log.database';
import { createLog } from '@zougui/log.logger/node';
import { createException } from '@zougui/common.error-utils';
import { LogLevel } from '@zougui/log.log-types';

import { AppService } from './app.service';

const MyError = createException<{ file: string }, Error>({
  code: 'some.error',
  message: 'An error occured',
  version: 'v1',
  name: 'MyError',
});

// @ts-ignore
const MyLog = createLog<{ url: string }, typeof MyError>({
  code: 'some.log',
  namespace: 'zougui:api-server',
  message: 'Something happened',
  tags: ['fs'],
  version: 'v1',
});

@Controller('/api/v1')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}

(async () => {
  const file = '/retgr/ezgtezr/egrz.txt';
  const fsError = await fs.readFile(file).catch(err => err);
  Object.defineProperty(fsError, 'stack', {
    configurable: true,
    enumerable: true,
    value: fsError.stack,
  });
  fsError.stack = fsError.stack;
  const error = new MyError({
    data: { file },
    cause: fsError,
  });

  const log = new MyLog({
    data: {
      url: 'http://localhost:8000',
    },
    cause: error,
  });
  const logObject = {
    ...log,
    level: LogLevel.info,
    message: log.getMessage({
      ...log,
      level: LogLevel.info,
    }),
  };

  await fs.writeFile('/mnt/Dev/Code/javascript/zougui/src/services/log/src/apps/api-server/log.json', JSON.stringify(logObject, null, 2))

  await connect();
  await logQueries.create(logObject);
})();
