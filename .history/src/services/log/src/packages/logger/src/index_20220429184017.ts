import { createLog, ConsoleLogger, BaseBatchLogger } from './node';
import { BatchLog } from './common/loggers/internal-types';;

const MyLog = createLog({
  code: 'my.log',
  namespace: 'zougui:logger',
  message: 'My log!',
  tags: [],
  version: 'v1',
});

const logger = new ConsoleLogger();

class BatchLogger extends BaseBatchLogger {
  sendLogs = async (batch: BatchLog[]) => {
    for (const { log, options } of batch) {
      await logger[options.level](log);
    }
  }
}

const batchLogger = new BatchLogger({ batch: { interval: '10 seconds' } });

const fn = () => {
  logger.debug(new MyLog() as any);
  logger.info(new MyLog() as any);
  logger.success(new MyLog() as any);
  logger.warn(new MyLog() as any);
  logger.error(new MyLog() as any);
}

fn();
