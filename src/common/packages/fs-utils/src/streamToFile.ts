import fs from 'fs-extra';

import { createTempFile, removeTempFile } from './tempFile';

export const streamToFile = async (file: string): Promise<fs.WriteStream> => {
  const tempFile = await createTempFile();
  const writeStream = fs.createWriteStream(tempFile);

  writeStream.once('finish', async () => {
    await fs.rename(tempFile, file);
    writeStream.removeAllListeners();
  });

  writeStream.once('error', async () => {
    writeStream.removeAllListeners();
    await removeTempFile(tempFile);
  });

  return writeStream;
}
