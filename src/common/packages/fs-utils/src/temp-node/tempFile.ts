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

export async function useTempFile<T>(callback: TempFileCallback<T>): Promise<T>;
export async function useTempFile<T>(options: UseTempFileOptions, callback: TempFileCallback<T>): Promise<T>;
export async function useTempFile<T>(
  optionsOrCallback?: UseTempFileOptions | TempFileCallback<T> | undefined,
  callback?: TempFileCallback<T> | undefined,
): Promise<T> {
  const maybeCallback = typeof optionsOrCallback === 'function' ? optionsOrCallback : callback;
  const actualCallback = maybeCallback as TempFileCallback<T>;
  const maybeOptions = typeof optionsOrCallback === 'object' ? optionsOrCallback : undefined;
  const tempFile = await createTempFile();
  let result: T;

  try {
    result = await actualCallback(tempFile);

    if (maybeOptions?.destFile) {
      await fs.rename(tempFile, maybeOptions.destFile);
    }
  } finally {
    await removeTempFile(tempFile);
  }

  return result;
}

export type TempFileCallback<T> = (filePath: string) => T | Promise<T>;

export interface UseTempFileOptions {
  destFile?: string | undefined;
}
