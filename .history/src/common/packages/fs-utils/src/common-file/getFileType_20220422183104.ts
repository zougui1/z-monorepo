import path from 'node:path';

import fileType from 'file-type';
import mime from 'mime-types';

export const getFileType = async (filePath: string): Promise<string | undefined> => {
  const binaryContentType = await fileType.fromFile(filePath);

  if (binaryContentType?.mime) {
    return binaryContentType.mime;
  }

  const plainContentType = mime.lookup(path.basename(filePath));

  if (plainContentType) {
    return plainContentType;
  }
}
