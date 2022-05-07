import type { Submission } from '@zougui/image-downloader.furaffinity';
import { mediaQueries, unprocessedMediaQueries } from '@zougui/image-downloader.database';
import { promiseExecAll } from '@zougui/common.promise-utils';
import { compact } from '@zougui/common.array';
import { createException, Exception } from '@zougui/common.error-utils';
import { createLog, createTaskLogs, logger } from '@zougui/log.logger/node';

//#region logging
const FindUndownloadedPostsError = createException<void, unknown>({
  name: 'FindUndownloadedPostsError',
  code: 'error.image-downloader.media.findUndownloadedPosts',
  message: ({ cause }) => `An error occured while trying to find out if the post has already been downloaded: ${cause.message}`,
  version: 'v1',
});

type FindUndownloadedPostsErrorLogData = {
  submissionUrl: string;
  downloadUrl: string;
  submissionId: string;
  type: string;
}

const FindUndownloadedPostsErrorLog = createLog<FindUndownloadedPostsErrorLogData, Exception>({
  code: 'image-downloader.media.findUndownloadedPosts.error',
  namespace: 'zougui:image-downloader:media',
  message: ({ cause }) => cause.message,
  version: 'v1',
});
//#endregion

export const getUndownloadedPosts = async (submissions: Submission[]): Promise<Submission[]> => {
  const submissionRequest = submissions
    .map(submission => {
      return [
        { metadata: { submission, type: 'processed' }, exec: () => mediaQueries.isAlreadyDownloaded(submission) },
        { metadata: { submission, type: 'unprocessed' }, exec: () => unprocessedMediaQueries.isAlreadyDownloaded(submission) },
      ];
    })
    .flat();

  const { successes, failures } = await promiseExecAll(submissionRequest);

  for (const { metadata, reason } of failures) {
    const error = new FindUndownloadedPostsError({ cause: reason });
    logger.warn(new FindUndownloadedPostsErrorLog({
      data: {
        submissionId: metadata.submission.id,
        submissionUrl: metadata.submission.url,
        downloadUrl: metadata.submission.downloadUrl,
        type: metadata.type,
      },
      cause: error,
    }));
  }

  return successes.filter(r => !r.value).map(r => r.metadata.submission);
}
