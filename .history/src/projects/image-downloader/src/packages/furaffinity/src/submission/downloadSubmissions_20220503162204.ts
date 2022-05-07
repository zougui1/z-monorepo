import { IResult, ISubmission, submission as findSubmission } from 'furaffinity-api';

import { getErrorMessage } from '@zougui/common.error-utils';

import { login } from '../login';
import { formatSubmission } from './formatSubmission';
import type { Submission } from '../types';

export const downloadSubmissions = async (submissions: (IResult | ISubmission)[]): Promise<SearchResult> => {
  login();

  const downloadedSubmissions: Submission[] = [];
  const erroredSubmissions: ErroredSubmission[] = [];

  for (const submissionResult of submissions) {
    console.log('download', submissionResult.url);

    try {
      const submission = await findSubmission(submissionResult.id);

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

export interface ErroredSubmission {
  url: string;
  errorMessage: string | undefined;
  submission: IResult | ISubmission;
}

export interface SearchResult {
  downloaded: Submission[];
  errored: ErroredSubmission[];
  retry: () => Promise<SearchResult>;
}
