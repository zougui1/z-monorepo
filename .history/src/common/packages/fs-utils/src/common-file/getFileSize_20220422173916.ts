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

(async () => {
  const file = '/mnt/Manjaro_Data/zougui/workspace/api-server/downloads/aa86aad7-b54f-423a-b45f-040721e2c40f';

  {
    console.group('first call');
    console.time('sharp');
    await sharp(file).metadata();
    console.timeEnd('sharp');

    console.time('sizeOf');
    await sizeOf(file);
    console.timeEnd('sizeOf');

    console.time('probe');
    const readStream = fs.createReadStream(file);
    await probe(readStream);
    console.timeEnd('probe');
    console.groupEnd();
  }

  {
    console.group('second call');
    console.time('sharp');
    await sharp(file).metadata();
    console.timeEnd('sharp');

    console.time('sizeOf');
    await sizeOf(file);
    console.timeEnd('sizeOf');

    console.time('probe');
    const readStream = fs.createReadStream(file);
    await probe(readStream);
    console.timeEnd('probe');
    console.groupEnd();
  }
})();
