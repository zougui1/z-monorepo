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
    await new Promise(r => setTimeout(r, 2000));
    for (const { log, options } of batch) {
      await logger[options.level](log);
    }
  }
}

const batchLogger = new BatchLogger({ batch: { interval: '2 seconds' } });

const fn = async () => {
  batchLogger.debug(new MyLog() as any);
  batchLogger.info(new MyLog() as any);
  batchLogger.success(new MyLog() as any);
  batchLogger.warn(new MyLog() as any);
  await batchLogger.error(new MyLog() as any);
  console.log('tt')
}

fn();
