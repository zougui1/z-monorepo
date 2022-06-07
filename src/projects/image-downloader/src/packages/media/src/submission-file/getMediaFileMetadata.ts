import path from 'node:path';

import fs from 'fs-extra';
import mime from 'mime-types';
import _ from 'lodash';

import { UnprocessedMediaDocument, OptimizedMedia } from '@zougui/image-downloader.database';
import { getFileSize, getFileHashAndType } from '@zougui/common.fs-utils';
import { promiseAll } from '@zougui/common.promise-utils';
import { createException } from '@zougui/common.error-utils';
import { createTaskLogs, logger } from '@zougui/log.logger/node';

import { downloadMedia } from './downloadMedia';
import { optimizeImage } from './optimizeImage';
import { getOptimizedMediaMetadata } from './getOptimizedMediaMetadata';

//#region logging
const DownloadAndProcessFileError = createException<void, unknown>({
  name: 'DownloadAndProcessFileError',
  code: 'error.image-downloader.media.downloadAndProcessFile',
  message: ({ cause }) => `An error occured while downloading and processing submission file: ${cause.message}`,
  version: 'v1',
});

const DownloadAndProcessFileTaskLog = createTaskLogs<
  { args: [media: UnprocessedMediaDocument] },
  { result: FileMetadata },
  Error
>({
  baseCode: 'image-downloader.media.downloadAndProcessFile',
  namespace: 'zougui:image-downloader:media',
  version: 'v1',
})
  .formatters({
    start: ({ data }) => ({
      media: _.pick(data.args[0], ['_id', 'id', 'url', 'downloadUrl']),
    }),
    success: ({ data }) => ({
      fileMetadata: _.pick(data.result, ['fileName', 'contentType', 'size', 'hashes']),
    }),
    error: ({ cause }) => new DownloadAndProcessFileError({ cause }),
  })
  .messages({
    start: ({ data }) => `Starting to download and process submission file "${data.media.downloadUrl}"`,
    success: 'Successfully downloaded and processed submission file',
    error: ({ cause }) => cause.message,
  });
//#endregion

export const getMediaFileMetadata = DownloadAndProcessFileTaskLog.wrap(async (media: UnprocessedMediaDocument): Promise<FileMetadata> => {
  const filePath = await downloadMedia(media.downloadUrl);

  // TODO delete the file at `filePath` if an error occurs
  // TODO delete all files that were created (optimizedImages) if an error occurs
  const {
    result,
    fileSize,
    fileStat,
    optimizedImages,
  } = await promiseAll({
    result: getFileHashAndType(filePath, {
      failsafePath: media.downloadUrl,
    }),
    // TODO do only if the file is an image
    optimizedImages: optimizeImage(filePath),
    fileSize: getFileSize(filePath),
    fileStat: fs.stat(filePath),
  });

  const extension = path.extname(media.originalFileName) || mime.extension(result.contentType) || 'unknown';
  const type = result.contentType.split('/')[0];

  const optimized = optimizedImages.map(images => {
    return getOptimizedMediaMetadata(images, {
      originalContentType: result.contentType,
      originalExtension: extension,
    });
  }).flat();

  return {
    fileName: path.basename(filePath),
    hashes: result.hashes,
    contentType: result.contentType,
    width: fileSize.width,
    height: fileSize.height,
    extension,
    size: fileStat.size,
    type,
    optimizedMedias: optimized,
  };
});

export interface FileMetadata {
  fileName: string;
  hashes: string[];
  contentType: string;
  width: number;
  height: number;
  extension: string;
  type: string;
  size: number;
  optimizedMedias: OptimizedMedia[];
}
