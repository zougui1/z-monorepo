import path from 'node:path';

import fileType from 'file-type';
import mime from 'mime-types';

export const getFileType = async (filePath: string, options?: GetFileTypeOptions | undefined): Promise<string | undefined> => {
  const binaryContentType = await fileType.fromFile(filePath);

  if (binaryContentType?.mime) {
    return binaryContentType.mime;
  }

  const plainContentType = mime.lookup(path.basename(filePath));

  if (plainContentType) {
    return plainContentType;
  }

  if (!options?.failsafePath) {
    return;
  }

  const failsafePlainContentType = mime.lookup(path.basename(options.failsafePath));

  if (failsafePlainContentType) {
    return failsafePlainContentType;
  }
}

export interface GetFileTypeOptions {
  failsafePath?: string | undefined;
}
