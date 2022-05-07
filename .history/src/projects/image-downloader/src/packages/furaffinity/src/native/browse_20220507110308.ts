import { browse as faBrowse } from 'furaffinity-api';
import _ from 'lodash';
import type { PromiseValue } from 'type-fest';

import { createException } from '@zougui/common.error-utils';
import { createTaskLogs, logger } from '@zougui/log.logger/node';

import { login } from '../login';

console.log('tt browse');

const FuraffinityBrowsingError = createException<void, unknown>({
  name: 'FuraffinityBrowsingError',
  code: 'error.furaffinity.browse',
  message: ({ cause }) => `An error occured while browsing furaffinity: ${cause.message}`,
  version: 'v1',
});

export type FaBrowse = typeof faBrowse;
export type FaBrowseParams = Parameters<FaBrowse>;
export type FaBrowseResolveType = PromiseValue<ReturnType<FaBrowse>>;

const BrowseTask = createTaskLogs<{ args: FaBrowseParams }, { result: FaBrowseResolveType }, Error>({
  baseCode: 'furaffinity.browse',
  messages: {
    start: 'Browsing furaffinity...',
  },
  namespace: 'zougui:furaffinity',
  version: 'v1',
})
  .formatters({
    success: (submissions) => ({
      submissions: submissions.result.map(sub => _.pick(sub, 'url')),
    }),
    error: cause => new FuraffinityBrowsingError({ cause }),
  })
  .messages({
    success: ({ data }) => `Found ${data.submissions.length} submissions.`,
    error: ({ cause }) => cause.message,
  });

export type Browse = (...args: FaBrowseParams) => Promise<{ result: FaBrowseResolveType }>;
export const browse: Browse = BrowseTask.wrap(faBrowse);

/*export const browse: typeof faBrowse = async (...args: Parameters<typeof faBrowse>): ReturnType<typeof faBrowse> => {
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
*/
