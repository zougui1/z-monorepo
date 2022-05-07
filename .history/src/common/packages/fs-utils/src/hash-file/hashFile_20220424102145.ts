import fileType from 'file-type';
import mime from 'mime-types';
import sharp from 'sharp';
import isAnimated from 'is-animated';
import fs from 'fs-extra';

import { hashTextFile } from './hashTextFile';
import { hashImage } from '../image';

const animatedFormats = ['apng', 'gif', 'webp'];

// TODO hash videos and animated images
export const hashFile = async (filePath: string): Promise<string[]> => {
  const contentType = await fileType.fromFile(filePath);

  const metadata = await sharp(filePath).metadata();
  metadata.exif

  if (contentType) {
    if (animatedFormats.includes(contentType.ext)) {
      const file = await fs.readFile(filePath);

      // TODO take the source code of the function and make it stream compatible
      // TODO to use in a worker as it can be an expensive task for big images
      if (isAnimated(file)) {
        throw new Error('Hashing animated images is not supported.');
      }
    }

    const [formatType] = contentType.mime.split('/');

    if (formatType !== 'image') {
      throw new Error(`Hashing files of type "${formatType}" is not supported.`);
    }

    const imageHash = await hashImage(filePath);
    return [imageHash];
  }

  const textHash = await hashTextFile(filePath);
  return [textHash];
}
