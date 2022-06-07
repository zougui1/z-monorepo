import _ from 'lodash';
import { DateTime } from 'luxon';

import { SearchObject, searchQueries, UnprocessedMediaDocument } from '@zougui/image-downloader.database';
import { ErroredSubmission, downloadSubmissions as faDownloadSubmissions } from '@zougui/image-downloader.furaffinity';
import { createException, Exception } from '@zougui/common.error-utils';
import { createTaskLogs } from '@zougui/log.logger/node';

import { searchSubmissionsFromDateRange, searchSubmissionsFromToday, downloadSubmissions } from '../submission';
import { saveMedia } from '../submission-file';

//#region find media logging
const DownloadPageError = createException<void, unknown>({
  name: 'DownloadPageError',
  code: 'error.image-downloader.media.downloadPage',
  message: ({ cause }) => `An error occured while downloading submissions: ${cause.message}`,
  version: 'v1',
});

const DownloadPageLog = createTaskLogs<{ args: [search: SearchObject] }, { result: DownloadPageResult }, Exception>({
  baseCode: 'image-downloader.media.downloadPage',
  namespace: 'zougui:image-downloader:media',
  version: 'v1',
})
  .formatters({
    start: ({ data }) => ({
      search: data.args[0],
    }),
    success: ({ data }) => ({
      total: data.result.total,
      downloaded: data.result.downloaded.map(sub => _.pick(sub,  ['_id', 'id', 'url', 'downloadUrl'])),
      errored: data.result.errored.map(sub => _.pick(sub,  ['id', 'url'])),
    }),
    error: ({ cause }) => new DownloadPageError({ cause }),
  })
  .messages({
    start: ({ data }) => `Start downloading page (query = "${data.search.query}")`,
    success: ({ data }) => (
`Download results:
  Downloaded: ${data.downloaded.length} submissions
  Failed to download: ${data.errored.length} submissions
  Already downloaded: ${data.total.length - data.downloaded.length - data.errored.length} submissions`
    ),
    error: ({ cause }) => cause.message,
  });
//#endregion

export const downloadPage = DownloadPageLog.wrap(async (search: SearchObject): Promise<DownloadPageResult> => {
  const [lastCursor] = search.cursors;

  if (!lastCursor) {
    // TODO throw Exception
    throw new Error('no cursors');
  }

  console.log({lastCursor})
  const lastDate = DateTime.fromJSDate(lastCursor.date);
  const formattedLastDate = lastDate.toLocaleString(DateTime.DATE_SHORT);
  const today = DateTime.now();
  // we want to test if the day is the same without taking the time into account
  const isLastCursorToday = formattedLastDate === today.toLocaleString(DateTime.DATE_SHORT);
  console.log({isLastCursorToday})

  await searchQueries.startDownloading({ id: search._id });

  const newSubmissions = isLastCursorToday
    ? await searchSubmissionsFromToday(search)
    : await searchSubmissionsFromDateRange(search);

  const submissions = await downloadSubmissions(newSubmissions);
  const undownloadedSubmissionCount = newSubmissions.total.length - newSubmissions.new.length;
  const lastSubmission = submissions.downloaded[submissions.downloaded.length - 1];
  const lastSubmissionDate = lastSubmission?.publishedAt && DateTime.fromJSDate(lastSubmission.publishedAt);

  let isDateGreaterThanCursorDate: boolean | undefined;

  if(undownloadedSubmissionCount > 0) {
    const undownloadedSubmissions = await faDownloadSubmissions([newSubmissions.total[0]]);

    const firstUndownloadedSubmissionFormattedDate = DateTime
      .fromJSDate(undownloadedSubmissions.downloaded[0].publishedAt)
      .toLocaleString(DateTime.DATE_SHORT);

    isDateGreaterThanCursorDate = firstUndownloadedSubmissionFormattedDate > formattedLastDate;
    console.log({firstUndownloadedSubmissionFormattedDate, formattedLastDate, isDateGreaterThanCursorDate})
  }

  const intersectsWithNextCursor = isLastCursorToday
    ? newSubmissions.new.length === 0
    : undownloadedSubmissionCount > 0;

  let newPage: number | undefined;
  let newPageCount: number | undefined;
  let newDate: Date | undefined;

  if (
    lastSubmissionDate &&
    // if the last submission date is older than the last cursor date
    lastSubmissionDate.toLocaleString(DateTime.DATE_SHORT) < formattedLastDate
  ) {
    newPage = lastCursor.currentPage - lastCursor.pageCount;
    newPageCount = 0;
    newDate = lastSubmission.publishedAt;
  } else if (intersectsWithNextCursor) {
    newPage = lastCursor.currentPage + 1;
    newPageCount = lastCursor.pageCount + 1;
  }

  await searchQueries.downloadedPage(
    { id: search._id, date: lastCursor.date },
    {
      failedToDownload: submissions.errored.map(err => err.url),
      // if at least one submission is not new then it means
      // the cursor is intersecting with another cursor that already
      // downloaded submissions from this page
      intersectsWithNextCursor,
      currentPage: newPage,
      pageCount: newPageCount,
      date: newDate,
    },
  );

  for (const submission of submissions.downloaded) {
    await saveMedia(submission);
  }

  return {
    ...submissions,
    total: newSubmissions.total,
    hasNextPage: newSubmissions.hasNextPage,
  };
});

export type DownloadPageResult = {
  total: { id: string; url: string }[];
  downloaded: UnprocessedMediaDocument[];
  errored: ErroredSubmission[];
  hasNextPage: boolean;
}
