import { search as faSearch } from 'furaffinity-api';
import _ from 'lodash';
import type { PromiseValue } from 'type-fest';

import { createException } from '@zougui/common.error-utils';
import { createTaskLogs } from '@zougui/log.logger/node';

import { login } from '../login';

const FuraffinitySearchingError = createException<void, unknown>({
  name: 'FuraffinitySearchingError',
  code: 'error.furaffinity.search',
  message: ({ cause }) => `An error occured while searching furaffinity: ${cause.message}`,
  version: 'v1',
});

export type FaSearch = typeof faSearch;
export type FaSearchParams = Parameters<FaSearch>;
export type FaSearchResolveType = PromiseValue<ReturnType<FaSearch>>;

const SearchTask = createTaskLogs<{ args: FaSearchParams }, { result: FaSearchResolveType }, Error>({
  baseCode: 'furaffinity.search',
  messages: {
    start: 'Searching furaffinity...',
  },
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
    success: ({ data }) => `Found ${data.submissions.length} submissions.`,
    error: ({ cause }) => cause.message,
  });

export type Search = (...args: FaSearchParams) => Promise<{ result: FaSearchResolveType }>;
export const search: Search = SearchTask.wrap((...args: FaSearchParams): Promise<FaSearchResolveType> => {
  login();
  return faSearch(...args);
});
