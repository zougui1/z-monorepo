import path from 'node:path';

import fs from 'fs-extra';
import mime from 'mime-types';

import { UnprocessedMediaDocument, OptimizedMedia } from '@zougui/image-downloader.database';
import { getFileSize, getFileHashAndType } from '@zougui/common.fs-utils';
import { promiseAll } from '@zougui/common.promise-utils';
import { createException } from '@zougui/common.error-utils';
import { createTaskLogs } from '@zougui/log.logger';

import { downloadMedia } from './downloadMedia';
import { optimizeImage } from './optimizeImage';
import { getOptimizedMediaMetadata } from './getOptimizedMediaMetadata';

export const getMediaFileMetadata = async (media: UnprocessedMediaDocument): Promise<FileMetadata> => {
  console.log('downloading submission...');
  // TODO use a stopwatch instead of `console.time`
  console.time('downloaded submission');
  const filePath = await downloadMedia(media.downloadUrl).finally(() => {
    console.timeEnd('downloaded submission');
  });

  // TODO delete the file at `filePath` if an error occurs
  // TODO delete all files that were created (optimizedImages) if an error occurs
  const { result, fileSize, fileStat, optimizedImages } = await promiseAll({
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
}

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
