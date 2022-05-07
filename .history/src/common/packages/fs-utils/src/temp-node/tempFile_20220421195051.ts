import path from 'node:path';

import fs from 'fs-extra';
import * as uuid from 'uuid';

import { tempDir } from '../constants';

const noop = () => { };

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

export async function useTempFile(callback: TempFileCallback): Promise<void>;
export async function useTempFile(options: UseTempFileOptions, callback: TempFileCallback): Promise<void>;
export async function useTempFile(
  optionsOrCallback?: UseTempFileOptions | TempFileCallback | undefined,
  callback?: TempFileCallback | undefined,
): Promise<void> {
  const maybeCallback = typeof optionsOrCallback === 'function' ? optionsOrCallback : callback;
  const actualCallback = maybeCallback || noop;
  const maybeOptions = typeof optionsOrCallback === 'object' ? optionsOrCallback : undefined;
  const tempFile = await createTempFile();

  try {
    await actualCallback(tempFile);

    if (maybeOptions?.destFile) {
      await fs.rename(tempFile, maybeOptions.destFile);
    }
  } finally {
    await removeTempFile(tempFile);
  }
}

export type TempFileCallback = (filePath: string) => void | Promise<void>;

export interface UseTempFileOptions {
  destFile?: string | undefined;
}
