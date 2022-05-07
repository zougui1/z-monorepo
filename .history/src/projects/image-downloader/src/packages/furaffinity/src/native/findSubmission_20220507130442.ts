import { IResult, ISubmission, submission as faFindSubmission } from 'furaffinity-api';
import _ from 'lodash';
import type { PromiseValue } from 'type-fest';
import type { SearchOptions } from 'furaffinity-api/dist/Request';

import { createException } from '@zougui/common.error-utils';
import { createTaskLogs } from '@zougui/log.logger/node';

import { wrapLogin } from '../login';

export const FuraffinityFindSubmissionError = createException<{ submissionId: string }, Error>({
  name: 'FuraffinityFindSubmissionError',
  code: 'error.furaffinity.search',
  message: ({ data, cause }) => `An error occured while trying to find submission (ID) "${data.submissionId}": ${cause.message}`,
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
      submissionId: data.args[0],
    }),
    success: ({ data: submission }) => ({
      submission: _.pick(submission.result, ['url', 'downloadUrl', 'id']),
    }),
  })
  .formatters({
    error: ({ cause, startData }) => new FuraffinityFindSubmissionError({ cause, data: { submissionId: startData.submissionId } }),
  })
  .messages({
    start: ({ data }) => `Searching for submission (ID) "${data.submissionId}" on furaffinity...`,
    success: ({ data }) => `Downloaded data of submission "${data.submission.url}".`,
    error: ({ cause }) => cause.message,
  });

export type FindSubmission = (...args: FaFindSubmissionParams) => Promise<{ result: FaFindSubmissionResolveType }>;
export const findSubmission: FindSubmission = SearchTask.wrap(wrapLogin(faFindSubmission));
export { SearchOptions };
