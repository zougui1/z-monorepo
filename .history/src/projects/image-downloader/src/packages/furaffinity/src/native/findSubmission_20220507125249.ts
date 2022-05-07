import { IResult, ISubmission, submission as faFindSubmission } from 'furaffinity-api';
import _ from 'lodash';
import type { PromiseValue } from 'type-fest';
import type { SearchOptions } from 'furaffinity-api/dist/Request';

import { createException } from '@zougui/common.error-utils';
import { createTaskLogs } from '@zougui/log.logger/node';

import { wrapLogin } from '../login';

export const FuraffinitySearchingError = createException<void, unknown>({
  name: 'FuraffinitySearchingError',
  code: 'error.furaffinity.search',
  message: ({ cause }) => `An error occured while searching furaffinity: ${cause.message}`,
  version: 'v1',
});

export type FaFindSubmission = typeof faFindSubmission;
export type FaFindSubmissionParams = Parameters<FaFindSubmission>;
export type FaFindSubmissionResolveType = PromiseValue<ReturnType<FaFindSubmission>>;

const SearchTask = createTaskLogs<{ args: FaFindSubmissionParams }, { result: FaFindSubmissionResolveType }, Error>({
  baseCode: 'furaffinity.findSubmission',
  namespace: 'zougui:furaffinity',
  version: 'v1',
})
  .formatters({
    start: ({ data }) => ({
      query: data.args[0],
      options: data.args[1],
    }),
    success: ({ data: submission }) => ({
      submission: _.pick(submission.result, ['url', 'downloadUrl', 'id']),
    }),
    error: cause => new FuraffinitySearchingError({ cause }),
  })
  .messages({
    start: 'Searching submissions on furaffinity...',
    success: ({ data }) => `Downloaded data of submission "${data.submission.url}".`,
    error: ({ cause }) => cause.message,
  });

export type FindSubmission = (...args: FaFindSubmissionParams) => Promise<{ result: FaFindSubmissionResolveType }>;
export const findSubmission: FindSubmission = SearchTask.wrap(wrapLogin(faFindSubmission));
export { SearchOptions };
