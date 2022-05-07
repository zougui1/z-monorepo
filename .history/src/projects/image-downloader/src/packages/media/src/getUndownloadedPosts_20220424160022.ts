import type { Submission, IResult } from '@zougui/image-downloader.furaffinity';
import { mediaQueries, unprocessedMediaQueries } from '@zougui/image-downloader.database';
import { promiseAll } from '@zougui/common.promise-utils';

export async function getUndownloadedPosts(submissions: Submission[]): Promise<Submission[]>;
export async function getUndownloadedPosts(submissions: IResult[]): Promise<IResult[]>;
export async function getUndownloadedPosts(submissions: (Submission | IResult)[]): Promise<(Submission | IResult)[]>;
export async function getUndownloadedPosts(submissions: (Submission | IResult)[]): Promise<(Submission | IResult)[]> {
  const submissionsExists = await Promise.all(submissions.map(async submission => {
    const { isInMedia, isInUnprocessedMedia } =  await promiseAll({
      isInMedia: mediaQueries.isAlreadyDownloaded(submission),
      isInUnprocessedMedia: unprocessedMediaQueries.isAlreadyDownloaded(submission),
    });

    return isInMedia || isInUnprocessedMedia;
  }));

  return submissions.filter((s, i) => !submissionsExists[i]);
}
