import { unprocessedMediaQueries, mediaQueries } from '@zougui/image-downloader.database';
import { IResult } from '@zougui/image-downloader.furaffinity';
import { createException, Exception } from '@zougui/common.error-utils';
import { createLog, logger } from '@zougui/log.logger/node';

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

export const findExistingSubmission = async (submission: IResult): Promise<string[]> => {
  try {
    const unprocessedMediaDoc = await unprocessedMediaQueries.findByUrl(submission.url);

    if (unprocessedMediaDoc) {
      return [unprocessedMediaDoc.url];
    }
  } catch (cause) {
    const error = new FindMediaByUrlError({
      data: {
        submissionUrl: submission.url,
        type: 'unprocessed',
      },
      cause,
    });
    logger.warn(new FindMediaByUrlErrorLog({ cause: error }));
  }

  try {
    const mediaDoc = await mediaQueries.findByUrl(submission.url);

    if (mediaDoc) {
      return mediaDoc.posts.map(post => post.urls).flat();
    }
  } catch (cause) {
    const error = new FindMediaByUrlError({
      data: {
        submissionUrl: submission.url,
        type: 'processed',
      },
      cause,
    });
    logger.warn(new FindMediaByUrlErrorLog({ cause: error }));
  }

  return [];
}
