import {
  unprocessedMediaQueries,
  mediaQueries,
  searchQueries,
  SearchDocument,
  UnprocessedMediaDocument,
} from '@zougui/image-downloader.database';
import {
  searchSubmissions,
  downloadSubmissions as faDownloadSubmissions,
} from '@zougui/image-downloader.furaffinity';
import { createException, Exception } from '@zougui/common.error-utils';
import { createLog, createTaskLogs, logger } from '@zougui/log.logger/node';

import { getUndownloadedPosts } from './getUndownloadedPosts';
import { createUnprocessedMedia } from './createUnprocessedMedia';

//#region find media logging
const FindMediaByUrlError = createException<{ type: string; submissionUrl: string }, unknown>({
  name: 'FindMediaByUrlError',
  code: 'error.image-downloader.media.findMediaByUrl',
  message: ({ cause }) => `An error occured while looking for a media: ${cause.message}`,
  version: 'v1',
});

const FindMediaByUrlErrorLog = createLog<void, Exception>({
  code: 'image-downloader.media.findMediaByUrl.error',
  namespace: 'zougui:image-downloader:media',
  message: ({ cause }) => cause.message,
  version: 'v1',
});
//#endregion

export const downloadSubmissions = async (search: SearchDocument): Promise<UnprocessedMediaDocument[]> => {
  console.log('downloading submissions...');
  console.time('submissions downloaded');
  await searchQueries.startDownloading({ id: search._id });
  const { result: submissions } = await searchSubmissions(search.query, {
    page: search.options.page || 1,
    orderBy: search.options.orderBy,
  });

  const existingSubmissions = await Promise.all(submissions.map(async submission => {
    const unprocessedMediaDoc = await unprocessedMediaQueries
      .findByUrl(submission.url)
      .catch(cause => {
        const error = new FindMediaByUrlError({
          data: {
            submissionUrl: submission.url,
            type: 'unprocessed',
          },
          cause,
        });
        logger.warn(new FindMediaByUrlErrorLog({ cause: error }));
      });

    if (unprocessedMediaDoc) {
      return [unprocessedMediaDoc.url];
    }

    const mediaDoc = await mediaQueries
      .findByUrl(submission.url)
      .catch(cause => {
        const error = new FindMediaByUrlError({
          data: {
            submissionUrl: submission.url,
            type: 'processed',
          },
          cause,
        });
        logger.warn(new FindMediaByUrlErrorLog({ cause: error }));
      });

    if (mediaDoc) {
      return mediaDoc.posts.map(post => post.urls).flat();
    }

    return [];
  }));
  const existingSubmissionsFlat = existingSubmissions.flat();

  const newSubmissions = submissions.filter(submission => {
    return !existingSubmissionsFlat.includes(submission.url);
  });

  const downloadResult = await faDownloadSubmissions(newSubmissions);

  const actualNewSubmissions = await getUndownloadedPosts(downloadResult.downloaded);
  const subsDocs = await createUnprocessedMedia(actualNewSubmissions);

  console.log('Submissions downloaded:', actualNewSubmissions.length);
  if (downloadResult.errored.length) {
    const erroredSubmissionList = downloadResult.errored.map(sub => `${sub.url}: ${sub.errorMessage}`);
    console.log('Failed to download:', '\n  ' + erroredSubmissionList.join('\n  '));
  }

  await searchQueries.downloadedPage(
    { id: search._id },
    { failedToDownload: downloadResult.errored.map(err => err.url) },
  );
  console.timeEnd('submissions downloaded');

  return subsDocs;
}
