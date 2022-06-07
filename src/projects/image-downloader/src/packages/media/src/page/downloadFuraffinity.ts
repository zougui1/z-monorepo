import _ from 'lodash';

import { createException, Exception } from '@zougui/common.error-utils';
import { wait } from '@zougui/common.promise-utils';
import { toMs } from '@zougui/common.ms';
import { createTaskLogs, logger, createLog } from '@zougui/log.logger/node';
import { SearchObject, searchQueries, UnprocessedMediaModel, SearchModel } from '@zougui/image-downloader.database';

import { downloadPage } from './downloadPage';
import { getSearch } from '../search';

//#region logging
const DownloadFuraffinityError = createException<void, unknown>({
  name: 'DownloadFuraffinityError',
  code: 'error.image-downloader.media.downloadFuraffinity',
  message: ({ cause }) => `An error occured while downloading furaffinity: ${cause.message}`,
  version: 'v1',
});

const DownloadFuraffinityTaskLog = createTaskLogs<{ args: [] }, { result: unknown }, Exception>({
  baseCode: 'image-downloader.media.downloadSubmissions',
  namespace: 'zougui:image-downloader:media',
  version: 'v1',
})
  .formatters({
    error: ({ cause }) => new DownloadFuraffinityError({ cause }),
  })
  .messages({
    start: 'Starting to download furaffinity...',
    success: 'Successfully downloaded furaffinity',
    error: ({ cause }) => cause.message,
  });
//#endregion

//! 30 minutes
const newCursorInterval = toMs('30 minutes');
//const downloadCursorInterval = toMs('10 minutes');
const downloadCursorInterval = 10;

export const downloadFuraffinity = DownloadFuraffinityTaskLog.wrap(async (): Promise<void> => {
  //await UnprocessedMediaModel.deleteMany();
  //await SearchModel.deleteMany();
  await startNewCursor();

  await Promise.allSettled([
    startNewCursorInterval(),
    downloadCursor(),
  ]);
});

const startNewCursor = _.throttle(async () => {
  const search = await getSearch();
  await searchQueries.startNewCursor({ id: search._id });
}, newCursorInterval);

const startNewCursorInterval = async () => {
  while (true) {
    await startNewCursor();

    // download new submissions 10 minutes after download complete
    await wait(newCursorInterval);
  }
};

const downloadCursor = async () => {
  let hasNextPage = true;

  while (hasNextPage) {
    const search = await getSearch();

    const downloadResult = await downloadPage(search);

    hasNextPage = downloadResult.hasNextPage;

    // download submissions 30 minutes after download complete
    await wait(downloadCursorInterval);
  }
}
