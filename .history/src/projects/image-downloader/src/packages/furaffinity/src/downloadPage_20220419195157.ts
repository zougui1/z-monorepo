import { search as faSearch, IResult, IPagingResults } from 'furaffinity-api';

import { getErrorMessage } from '@zougui/common.error-utils';
import type { WeakEnum } from '@zougui/common.type-utils';

import { login } from './login';
import { formatSubmission } from './formatSubmission';
import { OrderBy, OrderDirection, RangeType } from './enums';
import type { Submission } from './types';

export const search = async (query: string, options?: DownloadPageOptions | undefined): Promise<IPagingResults> => {
  login();

  const submissions = await faSearch(query, options);

  return submissions;
}

export const downloadPage = async (query: string, options?: DownloadPageOptions | undefined): Promise<SearchResult> => {
  login();

  const submissions = await faSearch(query, options);

  return await downloadSubmissions(submissions);
}

export const downloadSubmissions = async (submissions: IResult[]): Promise<SearchResult> => {
  login();

  const downloadedSubmissions: Submission[] = [];
  const erroredSubmissions: ErroredSubmission[] = [];

  for (const submissionResult of submissions) {
    console.log('download', submissionResult.url);

    try {
      const submission = await submissionResult.getSubmission();

      if (submission) {
        downloadedSubmissions.push(formatSubmission(submission));
      } else {
        erroredSubmissions.push({
          url: submissionResult.url,
          errorMessage: 'Submission not found',
          submission: submissionResult,
        });
      }
    } catch (error: any) {
      console.log(error);

      erroredSubmissions.push({
        url: submissionResult.url,
        errorMessage: getErrorMessage(error, 'An error occurred while downloading submission data'),
        submission: submissionResult,
      });
    }
  }

  return {
    downloaded: downloadedSubmissions,
    errored: erroredSubmissions,
    retry: async () => {
      return await downloadSubmissions(erroredSubmissions.map(sub => sub.submission));
    },
  };
}

export interface DownloadPageOptions {
  orderBy?: WeakEnum<OrderBy> | undefined;
  orderDirection?: WeakEnum<OrderDirection> | undefined;
  page?: number | undefined;
  range?: WeakEnum<RangeType> | undefined;
  rangeFrom?: Date | undefined;
  rangeTo?: Date | undefined;
}

export interface ErroredSubmission {
  url: string;
  errorMessage: string | undefined;
  submission: IResult;
}

export interface SearchResult {
  downloaded: Submission[];
  errored: ErroredSubmission[];
  retry: () => Promise<SearchResult>;
}
