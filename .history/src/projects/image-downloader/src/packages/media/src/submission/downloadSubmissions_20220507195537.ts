import _ from 'lodash';

import {
  searchQueries,
  SearchDocument,
  UnprocessedMediaDocument,
} from '@zougui/image-downloader.database';
import {
  searchSubmissions,
  downloadSubmissions as faDownloadSubmissions,
  ErroredSubmission,
} from '@zougui/image-downloader.furaffinity';
import { createException, Exception } from '@zougui/common.error-utils';
import { createTaskLogs, logger } from '@zougui/log.logger/node';

import { findExistingSubmission } from './findExistingSubmission';
import { getUndownloadedPosts } from './getUndownloadedPosts';
import { createUnprocessedMedia } from './createUnprocessedMedia';

//#region find media logging
const DownloadSubmissionsError = createException<void, unknown>({
  name: 'DownloadSubmissionsError',
  code: 'error.image-downloader.media.downloadSubmissions',
  message: ({ cause }) => `An error occured while downloading submissions: ${cause.message}`,
  version: 'v1',
});

const DownloadSubmissionsLog = createTaskLogs<{ search: SearchDocument }, DownloadSubmissionsResults, Exception>({
  baseCode: 'image-downloader.media.downloadSubmissions',
  namespace: 'zougui:image-downloader:media',
  messages: {
    start: ({ data }) => `Search submissions: query = "${data.search.query}", page = ${data.search.options.page}`,
    success: ({ data }) => (
`Download results:
  Downloaded: ${data.downloaded.length} submissions
  Failed to download: ${data.errored.length} submissions
  Already downloaded: ${data.total.length - data.errored.length} submissions`
    ),
    error: ({ cause }) => cause.message,
  },
  version: 'v1',
})
  .formatters({
    success: ({ data }) => ({
      total: data.total,
      downloaded: data.downloaded.map(sub => _.pick(sub,  ['_id', 'id', 'url', 'downloadUrl'])),
      errored: data.errored.map(sub => _.pick(sub,  ['id', 'url'])),
    }),
  });
//#endregion

export const downloadSubmissions = async (search: SearchDocument): Promise<UnprocessedMediaDocument[]> => {
  const taskLogs = new DownloadSubmissionsLog();

  try {
    logger.info(taskLogs.start({ data: { search } }));
    const data = await downloadSubmissions_(search);
    logger.success(taskLogs.success({ data }));

    return data.downloaded;
  } catch (cause) {
    const error = new DownloadSubmissionsError({ cause });
    logger.error(taskLogs.error({ cause: error }));

    throw error;
  }
}

export const downloadSubmissions_ = async (search: SearchDocument): Promise<DownloadSubmissionsResults> => {
  await searchQueries.startDownloading({ id: search._id });
  const { result: submissions } = await searchSubmissions(search.query, {
    page: search.options.page || 1,
    orderBy: search.options.orderBy,
  });

  const existingSubmissions = await Promise.all(submissions.map(findExistingSubmission));
  const existingSubmissionsFlat = existingSubmissions.flat();

  const newSubmissions = submissions.filter(submission => {
    return !existingSubmissionsFlat.includes(submission.url);
  });

  const downloadResult = await faDownloadSubmissions(newSubmissions);
  const actualNewSubmissions = await getUndownloadedPosts(downloadResult.downloaded);
  const submissionsDocs = await createUnprocessedMedia(actualNewSubmissions);

  await searchQueries.downloadedPage(
    { id: search._id },
    { failedToDownload: downloadResult.errored.map(err => err.url) },
  );

  return {
    total: submissions.map(sub =>_.pick(sub, ['id', 'url'])),
    downloaded: submissionsDocs,
    errored: downloadResult.errored,
  };
}

type DownloadSubmissionsResults = {
  total: { id: string; url: string }[];
  downloaded: UnprocessedMediaDocument[];
  errored: ErroredSubmission[];
}
