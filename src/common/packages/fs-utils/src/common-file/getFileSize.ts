import { promisify } from 'node:util';

import fs from 'fs-extra';
import sharp from 'sharp';
import sizeOf_ from 'image-size';
import probe from 'probe-image-size';

const sizeOf = promisify(sizeOf_);

export const getFileSize = async (filePath: string): Promise<{ width: number; height: number; }> => {
  const fileMetadata = await sharp(filePath).metadata().catch(() => undefined);

  if (fileMetadata?.width && fileMetadata?.height) {
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

  const readStream = fs.createReadStream(filePath);
  const probedSize = await probe(readStream).catch(() => undefined);

  if (!probedSize) {
    throw new Error(`Couldn't find the size of file "${filePath}"`);
  }

  return {
    width: probedSize.width,
    height: probedSize.height,
  };
}
