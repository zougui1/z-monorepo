import _ from 'lodash';

import { SearchObject } from '@zougui/image-downloader.database';
import { searchSubmissions, IResult, SearchOptions } from '@zougui/image-downloader.furaffinity';

import { findExistingSubmission } from './findExistingSubmission';

export const searchNewSubmissions = async (search: SearchObject, options?: SearchOptions | undefined): Promise<SearchNewSubmissionsResults> => {
  const submissions = await searchSubmissions(search.query, options);
  const hasNextPage = !!submissions.next;

  const existingSubmissions = await Promise.all(submissions.map(findExistingSubmission));
  const existingSubmissionsFlat = existingSubmissions.flat();

  const newSubmissions = submissions.filter(submission => {
    return !existingSubmissionsFlat.includes(submission.url);
  });

  return {
    total: submissions,
    new: newSubmissions,
    hasNextPage,
  };
}

export type SearchNewSubmissionsResults = {
  total: IResult[];
  new: IResult[];
  hasNextPage: boolean;
}
