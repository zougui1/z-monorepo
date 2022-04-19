import path from 'node:path';

import fs from 'fs-extra';
import * as uuid from 'uuid';

import { tempDir } from './constants';

export const createTempFile = async (): Promise<string> => {
  await fs.ensureDir(tempDir);
  const tempFile = path.join(tempDir, uuid.v4());

  return tempFile;
}

export const removeTempFile = async (tempFile: string): Promise<void> => {
  if (await fs.pathExists(tempFile)) {
    await fs.unlink(tempFile);
  }
}

export const useTempFile = async (callback: TempFileCallback): Promise<void> => {
  const tempFile = await createTempFile();

  try {
    await callback(tempFile);
  } finally {
    await removeTempFile(tempFile);
  }
}

export type TempFileCallback = (filePath: string) => void | Promise<void>;
