import { LogKind } from '@zougui/log.log-types';
import { createTaskLogs, logger } from './node';

export * from './common';

const TaskLog = createTaskLogs({
  baseCode: 't',
  namespace: 'zougui:id',
  version: 'v1',
  messages: {
    start: 'start',
    success: 'success',
    error: 'error',
  },
  logKinds: [LogKind.console],
});

const parallelTasks = new Array(10).fill(0).map(t => new TaskLog());

(async () => {
  Promise.all(parallelTasks.map(async task => {
    logger.debug(task.start());
    await new Promise(r => setTimeout(r, 10));
    logger.debug(task.success());
  }));
})();
