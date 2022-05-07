import fs from 'fs-extra';
import sharp from 'sharp';
import isAnimated from 'is-animated';

export const getFileSize = async (filePath: string): Promise<boolean> => {
  const fileMetadata = await sharp(filePath).metadata();

  if (fileMetadata.pages) {
    // pages = frames
    return fileMetadata.pages > 1;
  }


  // TODO take the source code of the function and make it stream compatible
  // TODO to use in a worker as it can be an expensive task for big images
  const file = await fs.readFile(filePath);
  return isAnimated(file);
}
