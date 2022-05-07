import { browse as faBrowse } from 'furaffinity-api';

import { createException } from '@zougui/common.error-utils';
import { createTaskLogs, logger } from '@zougui/log.logger/node';

const FuraffinityBrowsingError = createException<void, unknown>({
  name: 'FuraffinityBrowsingError',
  code: 'error.furaffinity.browse',
  message: ({ cause }) => `An error occured while browsing furaffinity: ${cause.error}`,
  version: 'v1',
})

const BrowseTask = createTaskLogs<void, void, InstanceType<typeof FuraffinityBrowsingError>>({
  baseCode: 'furaffinity.browse',
  messages: {
    start: 'Browsing furaffinity...',
    success: 'Browsed furaffinity successfully.',
    error: ({ cause }) => cause.message,
  },
  namespace: 'zougui:furaffinity',
  version: 'v1',
});

export const browse: typeof faBrowse = async (...args: Parameters<typeof faBrowse>): ReturnType<typeof faBrowse> => {
  const taskLogs = new BrowseTask();

  logger.info(taskLogs.start());

  try {
    const result = await faBrowse(...args);
    logger.success(taskLogs.success());

    return result;
  } catch (error) {
    logger.error(taskLogs.error({ cause: new FuraffinityBrowsingError({ cause: error }) }));
    throw error;
  }
}
