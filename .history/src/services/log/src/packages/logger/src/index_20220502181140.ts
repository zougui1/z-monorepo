import { createLog, ConsoleLogger, BaseBatchLogger, Logger } from './node';
import { BatchLog } from './common/loggers/internal-types';;

const MyLog = createLog({
  code: 'my.log',
  namespace: 'zougui:logger',
  message: 'My log!',
  tags: [],
  version: 'v1',
});

const logger = new Logger({
  http: {
    batch: { interval: '2 seconds' },
  },
});

const fn = async () => {
  logger.debug(new MyLog() as any);
  logger.info(new MyLog() as any);
  logger.success(new MyLog() as any);
  logger.warn(new MyLog() as any);
  await logger.error(new MyLog() as any);
  console.log('tt')
  process.exit(0);
}

fn();
