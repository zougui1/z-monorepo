import { promisify } from 'node:util';

import sharp from 'sharp';
import probe from 'probe-image-size';
import sizeOf_ from 'image-size';

const sizeOf = promisify(sizeOf_);

export const getFileSize = async (filePath: string) => {
  const fileMetadata = await sharp(filePath).metadata();

  if (fileMetadata.width && fileMetadata.height) {
    return formatSize(fileMetadata);
  }

  const size = await sizeOf(filePath).catch(() => undefined);

  if (size) {
    return formatSize(size);
  }

  const probedSize = await probe(filePath).catch(() => undefined);

  if (!probedSize) {
    throw new Error(`Couldn't find the size of file "${filePath}"`);
  }

  return formatSize(probedSize);
}

/**
 * ensures that there is not too many data, nothing more than the width and height
 * @param size
 * @returns
 */
const formatSize = (size: { width: number; height: number }): { width: number; height: number } => {
  return {
    width: size.width,
    height: size.height,
  };
}
