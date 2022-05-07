//export * from './common';

import { createLog, createTaskLogs, ConsoleLogger, BaseBatchLogger, Logger } from './node';
import { BatchLog } from './common/loggers/internal-types';;

const MyLog = createLog({
  code: 'my.log',
  namespace: 'zougui:logger',
  message: 'My log!',
  tags: [],
  version: 'v1',
});

const MyTask = createTaskLogs<{ url: string }, { id: string }, Error>({
  baseCode: 'my.log',
  namespace: 'zougui:logger',
  messages: {
    start: 'Starting...',
    success: 'Success!',
    error: 'Error!',
  },
  tags: [],
  version: 'v1',
})
  /*.dataFormatters({
    success: data => ({ id: data.id, length: data.id.length }),
    error: () => new Error('new'),
  });*/

const logger = new Logger({
  loggers: ['console', 'http'],
  http: {
    batch: { interval: '2 seconds' },
    //minLogLevel: 'warn'
  },
});

const fn = async () => {
  const logs = new MyTask();
  const start = logs.start({ data: { url: '' } });
  const success = logs.success({ data: { id: '' } });
  const error = logs.error({ cause: new Error('err') });
  /*start.data.url;
  start.data.length;
  success.data.id;
  success.data.length;*/
  console.log(start.data);
  console.log(success.data);
  console.log(error.cause);

  /*logger.debug(new MyLog() as any);
  logger.info(new MyLog() as any);
  logger.success(new MyLog() as any);
  logger.warn(new MyLog() as any);
  await logger.error(new MyLog() as any);
  console.log('tt')

  const taskLogs = new MyTask();

  logger.debug(taskLogs.start());
  console.log('something');
  await logger.success(taskLogs.success());*/
  process.exit(0);
}

fn();
export * from './common';
