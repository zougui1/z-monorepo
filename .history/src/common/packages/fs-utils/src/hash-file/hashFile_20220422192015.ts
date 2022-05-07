import fileType from 'file-type';

import { hashTextFile } from './hashTextFile';
import { hashImage } from '../image';

// TODO hash videos and animated images
export const hashFile = async (filePath: string): Promise<string[]> => {
  const contentType = await fileType.fromFile(filePath);

  if (contentType) {
    const imageHash = await hashImage(filePath);
    return [imageHash];
  }

  const textHash = await hashTextFile(filePath);
  return [textHash];
}
