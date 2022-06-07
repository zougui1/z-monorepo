import _ from 'lodash';

import type { UnprocessedMediaDocument } from '@zougui/image-downloader.database';
import {
  downloadSubmissions as faDownloadSubmissions,
  ErroredSubmission,
} from '@zougui/image-downloader.furaffinity';
import { createException, Exception } from '@zougui/common.error-utils';
import { createTaskLogs, logger } from '@zougui/log.logger/node';

import { SearchNewSubmissionsResults } from './searchNewSubmissions';
import { getUndownloadedPosts } from './getUndownloadedPosts';
import { createUnprocessedMedia } from './createUnprocessedMedia';

//#region find media logging
const DownloadSubmissionsError = createException<void, unknown>({
  name: 'DownloadSubmissionsError',
  code: 'error.image-downloader.media.downloadSubmissions',
  message: ({ cause }) => `An error occured while downloading submissions: ${cause.message}`,
  version: 'v1',
});

const DownloadSubmissionsLog = createTaskLogs<{ submissions: SearchNewSubmissionsResults }, DownloadSubmissionsResults, Exception>({
  baseCode: 'image-downloader.media.downloadSubmissions',
  namespace: 'zougui:image-downloader:media',
  version: 'v1',
})
  .formatters({
    success: ({ data }) => ({
      downloaded: data.downloaded.map(sub => _.pick(sub,  ['_id', 'id', 'url', 'downloadUrl'])),
      errored: data.errored.map(sub => _.pick(sub,  ['id', 'url'])),
    }),
  })
  .messages({
    start: ({ data }) => `Start downloading ${data.submissions.new.length} submissions`,
    success: ({ data }) => (
`Download results:
  Downloaded: ${data.downloaded.length} submissions
  Failed to download: ${data.errored.length} submissions`
    ),
    error: ({ cause }) => cause.message,
  });
//#endregion

export const downloadSubmissions = async (submissions: SearchNewSubmissionsResults): Promise<DownloadSubmissionsResults> => {
  const taskLogs = new DownloadSubmissionsLog();

  try {
    logger.info(taskLogs.start({ data: { submissions } }));
    const data = await downloadSubmissions_(submissions);
    logger.success(taskLogs.success({ data }));

    return data;
  } catch (cause) {
    const error = new DownloadSubmissionsError({ cause });
    logger.error(taskLogs.error({ cause: error }));

    throw error;
  }
}

export const downloadSubmissions_ = async (submissions: SearchNewSubmissionsResults): Promise<DownloadSubmissionsResults> => {
  const downloadResult = await faDownloadSubmissions(submissions.new);
  const actualNewSubmissions = await getUndownloadedPosts(downloadResult.downloaded);
  const submissionsDocs = await createUnprocessedMedia(actualNewSubmissions);

  return {
    downloaded: submissionsDocs,
    errored: downloadResult.errored,
  };
}

export type DownloadSubmissionsResults = {
  downloaded: UnprocessedMediaDocument[];
  errored: ErroredSubmission[];
}
