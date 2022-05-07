import { search as faSearch } from 'furaffinity-api';
import _ from 'lodash';
import type { PromiseValue } from 'type-fest';

import { createException } from '@zougui/common.error-utils';
import { createTaskLogs } from '@zougui/log.logger/node';

import { wrapLogin } from '../login';

const FuraffinitySearchingError = createException<void, unknown>({
  name: 'FuraffinitySearchingError',
  code: 'error.furaffinity.search',
  message: ({ cause }) => `An error occured while searching furaffinity: ${cause.message}`,
  version: 'v1',
});

export type FaSearchSubmissions = typeof faSearch;
export type FaSearchSubmissionsParams = Parameters<FaSearchSubmissions>;
export type FaSearchSubmissionsResolveType = PromiseValue<ReturnType<FaSearchSubmissions>>;

const SearchTask = createTaskLogs<{ args: FaSearchSubmissionsParams }, { result: FaSearchSubmissionsResolveType }, Error>({
  baseCode: 'furaffinity.searchSubmissions',
  namespace: 'zougui:furaffinity',
  version: 'v1',
})
  .formatters({
    start: ({ args: [query, options] }) => ({ query, options }),
    success: (submissions) => ({
      submissions: submissions.result.map(sub => _.pick(sub, 'url')),
    }),
    error: cause => new FuraffinitySearchingError({ cause }),
  })
  .messages({
    start: 'Searching submissions on furaffinity...',
    success: ({ data }) => `Found ${data.submissions.length} submissions.`,
    error: ({ cause }) => cause.message,
  });

export type SearchSubmissions = (...args: FaSearchSubmissionsParams) => Promise<{ result: FaSearchSubmissionsResolveType }>;
export const searchSubmissions: SearchSubmissions = SearchTask.wrap(wrapLogin(faSearch));
