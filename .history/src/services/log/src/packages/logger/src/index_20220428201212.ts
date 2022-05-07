import chalk from 'chalk';
import { createLog, ConsoleLogger } from './node';

const MyLog = createLog({
  code: 'my.log',
  namespace: 'zougui:logger',
  message: 'My log!',
  tags: [],
  version: 'v1',
});

chalk.red('t')

const logger = new ConsoleLogger();

const fn = () => {
  logger.print(new MyLog() as any);
}

fn();
