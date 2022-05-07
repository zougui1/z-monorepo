import { search as faSearch } from 'furaffinity-api';
import _ from 'lodash';
import type { PromiseValue } from 'type-fest';
import type { SearchOptions } from 'furaffinity-api/dist/Request';

import { createException } from '@zougui/common.error-utils';
import { createTaskLogs } from '@zougui/log.logger/node';

import { wrapLogin } from '../login';

export const FuraffinitySearchError = createException<void, Error>({
  name: 'FuraffinitySearchError',
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
    start: ({ data }) => ({
      query: data.args[0],
      options: data.args[1],
    }),
    success: ({ data: submissions }) => ({
      submissions: submissions.result.map(sub => _.pick(sub, ['url', 'id'])),
    }),
    error: ({ cause }) => new FuraffinitySearchError({ cause }),
  })
  .messages({
    start: ({ data }) => `Searching submissions on furaffinity with query "${data.query}" on page ${data.options?.page || 1}`,
    success: ({ data }) => `Found ${data.submissions.length} submissions.`,
    error: ({ cause }) => cause.message,
  });

export type SearchSubmissions = (...args: FaSearchSubmissionsParams) => Promise<{ result: FaSearchSubmissionsResolveType }>;
export const searchSubmissions: SearchSubmissions = SearchTask.wrap(wrapLogin(faSearch));
export { SearchOptions };
