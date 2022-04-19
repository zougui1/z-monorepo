import path from 'node:path';

import fs from 'fs-extra';

import { createSpies } from '@zougui/common.jest-utils';

import { createTempFile, removeTempFile, useTempFile } from './tempFile';
import { tempDir } from './constants';

const uuid = 'erghiu-fgerijnouefg';

jest.mock('uuid', () => {
  return {
    v4: () => uuid
  }
});

describe('createTempFile()', () => {
  const spies = createSpies(() => ({
    fs: {
      ensureDir: jest.spyOn(fs, 'ensureDir'),
    },
  }));

  it('should ensure that the temp directory exists and return a generated file name', async () => {
    const expectedTempFile = path.join(tempDir, uuid);

    const tempFile = await createTempFile();

    expect(tempFile).toBe(expectedTempFile);
    expect(spies.fs.ensureDir).toBeCalledTimes(1);
    expect(spies.fs.ensureDir).toBeCalledWith(tempDir);
  });
});

describe('removeTempFile()', () => {
  const spies = createSpies(() => ({
    fs: {
      pathExists: jest.spyOn(fs, 'pathExists'),
      unlink: jest.spyOn(fs, 'unlink'),
    },
  }));

  it('should unlink the file if it exists', async () => {
    const tempFile = path.join(tempDir, uuid);
    spies.fs.pathExists.mockImplementation(async () => true);

    await removeTempFile(tempFile);

    expect(spies.fs.unlink).toBeCalledTimes(1);
    expect(spies.fs.unlink).toBeCalledWith(tempFile);
  });

  it('should not unlink the file if it does not exist', async () => {
    const tempFile = path.join(tempDir, uuid);
    spies.fs.pathExists.mockImplementation(async () => false);

    await removeTempFile(tempFile);

    expect(spies.fs.unlink).not.toBeCalled();
  });
});

describe('useTempFile()', () => {
  const spies = createSpies(() => ({
    fs: {
      ensureDir: jest.spyOn(fs, 'ensureDir'),
      pathExists: jest.spyOn(fs, 'pathExists'),
      unlink: jest.spyOn(fs, 'unlink'),
    },
  }));

  it('should create a temp file usable only within the callback', async () => {
    const expectedTempFile = path.join(tempDir, uuid);
    spies.fs.pathExists.mockImplementation(async () => true);

    let file: string | undefined;
    let resolve: ((value: void | PromiseLike<void>) => void) | undefined;
    let reject: ((reason?: any) => void) | undefined;

    const tempFilePromise = useTempFile(tempFile => {
      file = tempFile;
      return new Promise((res, rej) => {
        resolve = res;
        reject = rej;
      });
    });

    await new Promise(process.nextTick);

    expect(file).toBe(expectedTempFile);
    expect(spies.fs.ensureDir).toBeCalledTimes(1);
    expect(spies.fs.ensureDir).toBeCalledWith(tempDir);
    // the callback has not fulfilled yet so the unlink is not called yet
    expect(spies.fs.unlink).not.toBeCalled();

    // resolve the callback for `useTempFile` to finish its job
    resolve?.();
    await new Promise(process.nextTick);

    expect(spies.fs.unlink).toBeCalledTimes(1);
    expect(spies.fs.unlink).toBeCalledWith(expectedTempFile);

    // ensures that the promise returned by `useTempFile` actually resolves
    await tempFilePromise;
  });
});
