import crypto from 'node:crypto';

import fs from 'fs-extra';

import { waitEndOfStream } from '../streams';

export const hashTextFile = async (filePath: string): Promise<string> => {
  const readStream = fs.createReadStream(filePath);
  const hasher = crypto.createHash('sha256', { encoding: 'hex' });

  readStream.pipe(hasher);

  await waitEndOfStream(readStream).finally(() => hasher.end());
  const hash = hasher.read();

  return hash;
}
