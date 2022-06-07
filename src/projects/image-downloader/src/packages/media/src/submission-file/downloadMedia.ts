import path from 'node:path';

import fs from 'fs-extra';
import * as uuid from 'uuid';

import { downloadFile } from '@zougui/common.fs-utils';
import { createException, Exception } from '@zougui/common.error-utils';
import { createTaskLogs, logger } from '@zougui/log.logger/node';

import { mediaDir } from '../constants';

//#region logging
const DownloadMediaError = createException<void, unknown>({
  name: 'DownloadMediaError',
  code: 'error.image-downloader.media.downloadMedia',
  message: ({ cause }) => `An error occured while downloading submission file: ${cause.message}`,
  version: 'v1',
});

const DownloadMediaTaskLog = createTaskLogs<{ url: string }, { file: string }, Exception>({
  baseCode: 'image-downloader.media.downloadSubmissions',
  namespace: 'zougui:image-downloader:media',
  messages: {
    start: ({ data }) => `Downloading submission file from "${data.url}"`,
    success: ({ data }) => `Submission file downloaded to "${data.file}"`,
    error: ({ cause }) => cause.message,
  },
  version: 'v1',
});
//#endregion

export const downloadMedia = async (url: string): Promise<string> => {
  const file = path.join(mediaDir, uuid.v4());
  const taskLogs = new DownloadMediaTaskLog();
  await fs.ensureDir(mediaDir);

  try {
    logger.info(taskLogs.start({ data: { url } }));
    await downloadFile(url, { file });
    logger.success(taskLogs.success({ data: { file } }));
  } catch (error) {
    const cause = new DownloadMediaError({ cause: error });
    logger.error(taskLogs.error({ cause }));
    throw cause;
  }

  return file;
}
