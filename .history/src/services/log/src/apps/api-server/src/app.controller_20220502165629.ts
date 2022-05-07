import { Controller, Get } from '@nestjs/common';

import { connect, logQueries } from '@zougui/log.logger';
import { createLog } from '@zougui/log.logger/node';
import { LogLevel } from '@zougui/log.log-types';

import { AppService } from './app.service';

const MyLog = createLog({
  code: 'some.log',
  namespace: 'zougui:api-server',
  message: 'Something happened',
  tags: ['api-server'],
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
  const log = new MyLog();
  const logObject = {
    ...log,
    level: LogLevel.info,
    message: log.getMessage({
      ...log,
      level: LogLevel.info,
    }),
  };

  await connect();
  await logQueries.create(logObject);
})();
