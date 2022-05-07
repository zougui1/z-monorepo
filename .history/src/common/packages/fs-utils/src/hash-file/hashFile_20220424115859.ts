import fileType from 'file-type';
import fs from 'fs-extra';

import { hashTextFile } from './hashTextFile';
import { hashImage, isImageAnimated } from '../image';

const animatedFormats = ['apng', 'gif', 'webp'];

// TODO hash videos and animated images
export const hashFile = async (filePath: string): Promise<string[]> => {
  const contentType = await fileType.fromFile(filePath);

  if (contentType) {
    if (animatedFormats.includes(contentType.ext)) {
      const isAnimated = await isImageAnimated(filePath);

      if (isAnimated) {
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
