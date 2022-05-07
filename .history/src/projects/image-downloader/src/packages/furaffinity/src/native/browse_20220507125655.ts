import { browse as faBrowse } from 'furaffinity-api';
import _ from 'lodash';
import type { PromiseValue } from 'type-fest';

import { createException } from '@zougui/common.error-utils';
import { createTaskLogs } from '@zougui/log.logger/node';

import { wrapLogin } from '../login';

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
  namespace: 'zougui:furaffinity',
  version: 'v1',
})
  .formatters({
    success: ({ data: submissions }) => ({
      submissions: submissions.result.map(sub => _.pick(sub, ['url', 'id'])),
    }),
    error: ({ cause }) => new FuraffinityBrowsingError({ cause }),
  })
  .messages({
    start: 'Browsing furaffinity...',
    success: ({ data }) => `Found ${data.submissions.length} submissions.`,
    error: ({ cause }) => cause.message,
  });

export type Browse = (...args: FaBrowseParams) => Promise<{ result: FaBrowseResolveType }>;
export const browse: Browse = BrowseTask.wrap(wrapLogin(faBrowse));
