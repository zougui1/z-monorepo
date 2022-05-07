import type { Submission } from '@zougui/image-downloader.furaffinity';
import { mediaQueries, unprocessedMediaQueries } from '@zougui/image-downloader.database';
import { promiseAll } from '@zougui/common.promise-utils';

export const getUndownloadedPosts = async (submissions: Submission[]): Promise<Submission[]> => {
  const submissionsExists = await Promise.all(submissions.map(async submission => {
    const { isInMedia, isInUnprocessedMedia } =  await promiseAll({
      isInMedia: mediaQueries.isAlreadyDownloaded(submission),
      isInUnprocessedMedia: unprocessedMediaQueries.isAlreadyDownloaded(submission),
    });

    return isInMedia || isInUnprocessedMedia;
  }));

  return submissions.filter((s, i) => !submissionsExists[i]);
}
