import { createLog, ConsoleLogger } from './node';

const MyLog = createLog({
  code: 'my.log',
  namespace: 'zougui:logger',
  message: 'My log!',
  tags: [],
  version: 'v1',
});

const logger = new ConsoleLogger();

const fn = () => {
  logger.print(new MyLog());
}

fn();
