import config from '@zougui/common.config/node';
import { compact } from '@zougui/common.array';
import env from '@zougui/common.env/node';

import { Logger } from './loggers';

const DEBUG = env.get('DEBUG').asString();

export const logger = new Logger({
  ...config.log.logger,
  loggers: compact(config.log.logger.loggers),
  console: {
    namespace: DEBUG,
  },
});

export * from './Log';
export * from './loggerVersion';
export * from './loggers';
