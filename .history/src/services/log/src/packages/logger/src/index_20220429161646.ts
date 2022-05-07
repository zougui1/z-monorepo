import { createLog, ConsoleLogger } from './node';

const MyLog = createLog({
  code: 'my.log',
  namespace: 'zougui:logger',
  message: 'My log!',
  tags: [],
  version: 'v1',
});

const logger = new ConsoleLogger({ namespace: 'zougui:*' });

const fn = () => {
  logger.debug(new MyLog() as any);
}

fn();
