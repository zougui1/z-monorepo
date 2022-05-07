import { promisify } from 'node:util';

import sharp from 'sharp';
import probe from 'probe-image-size';
import sizeOf_ from 'image-size';

const sizeOf = promisify(sizeOf_);

export const getFileSize = async (filePath: string): Promise<{ width: number; height: number; }> => {
  const fileMetadata = await sharp(filePath).metadata().catch(() => undefined);

  if (fileMetadata.width && fileMetadata.height) {
    return {
      width: fileMetadata.width,
      height: fileMetadata.height,
    };
  }

  const size = await sizeOf(filePath).catch(() => undefined);

  if (size?.width && size?.height) {
    return {
      width: size.width,
      height: size.height,
    };
  }

  const probedSize = await probe(filePath).catch(() => undefined);

  if (!probedSize) {
    throw new Error(`Couldn't find the size of file "${filePath}"`);
  }

  return {
    width: probedSize.width,
    height: probedSize.height,
  };
}
