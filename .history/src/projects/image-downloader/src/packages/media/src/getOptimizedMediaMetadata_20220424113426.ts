import path from 'node:path';

import mime from 'mime-types';

import { OptimizedMedia } from '@zougui/image-downloader.database';

import type { OptimizeImageResult } from './optimizeImage';

export const getOptimizedMediaMetadata = (media: OptimizeImageResult, options: GetOptimizedMediaMetadataOptions): OptimizedMedia[] => {
  const { originalContentType, originalExtension } = options;

  const optimizedMedias = Object.values(media).map(image => {
    if (typeof image !== 'object') {
      return;
    }

    const transformations = ['resize'];
    const isOriginalFormat = image.format === 'original';

    if (!isOriginalFormat) {
      transformations.push('reformat');
    }

    const fileName = path.basename(image.file);
    const contentType = isOriginalFormat
      ? originalContentType
     : mime.lookup(image.format);

    if(!contentType) {
      return;
    }

    return {
      extension: originalExtension,
      fileName,
      size: image.output.size,
      width: image.output.width,
      height: image.output.height,
      transformations,
      label: image.label,
      contentType,
      type: contentType.split('/')[0],
    };
  }).filter(Boolean) as OptimizedMedia[];

  return optimizedMedias;
}

export interface GetOptimizedMediaMetadataOptions {
  originalContentType: string;
  originalExtension: string;
}
