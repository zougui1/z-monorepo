import { browse as faBrowse } from 'furaffinity-api';

import { createException } from '@zougui/common.error-utils';
import { createTaskLogs, logger } from '@zougui/log.logger/node';

import { login } from '../login';

const FuraffinityBrowsingError = createException<void, unknown>({
  name: 'FuraffinityBrowsingError',
  code: 'error.furaffinity.browse',
  message: ({ cause }) => `An error occured while browsing furaffinity: ${cause.message}`,
  version: 'v1',
})

// TODO make data formatting functions for each step
// TODO make a basic method `exec` usable this way:
/**
 * MyTask#start gets the function's params
 * MyTask#success gets the function's returned value
 * MyTask#error gets the function's thrown error
 * @example
 * MyTask.wrap(myFunction)(funcParams);
 */
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
  } catch (err) {
    const error = new FuraffinityBrowsingError({ cause: err });
    logger.error(taskLogs.error({ cause: error }));

    throw error;
  }
}
