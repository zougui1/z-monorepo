import { createLog, ConsoleLogger } from './node';

const MyLog = createLog({
  code: 'my.log',
  namespace: 'zougui:logger',
  message: 'My log!',
  tags: [],
  version: 'v1',
  timings: {
    formatted: '45 ms',
  },
} as any);

const logger = new ConsoleLogger();

const fn = () => {
  logger.debug(new MyLog() as any);
}

fn();
