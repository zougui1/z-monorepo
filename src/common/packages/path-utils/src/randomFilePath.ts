import path from 'node:path';

import * as uuid from 'uuid';

export const randomFilePath = (options?: RandomFilePathOptions | undefined): string => {
  const generatedFileName = uuid.v4();
  const fileName = options?.extension
    ? `${generatedFileName}.${options.extension}`
    : generatedFileName;

  const filePath = options?.dir
    ? path.join(options.dir, fileName)
    : fileName;

  return filePath;
}

export interface RandomFilePathOptions {
  dir?: string | undefined;
  extension?: string | undefined;
}
