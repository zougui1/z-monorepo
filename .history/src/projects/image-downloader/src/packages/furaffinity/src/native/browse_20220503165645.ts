import { browse as faBrowse } from 'furaffinity-api';

import { createException } from '@zougui/common.error-utils';
import { createTaskLogs } from '@zougui/log.logger/node';

const FuraffinityBrowsingError = createException<void, unknown>({
  code: 'error.furaffinity.browse',
  message: ()
})

const BrowseTask = createTaskLogs({
  baseCode: 'furaffinity.browse',
  messages: {
    start: 'Browsing furaffinity...',
    success: 'Browsed furaffinity successfully.',
    error:
  }
})

export const browse: typeof faBrowse = async (...args: Parameters<typeof faBrowse>): ReturnType<typeof faBrowse> => {
  const result = await faBrowse(...args);
  result.length

  return result;
}
