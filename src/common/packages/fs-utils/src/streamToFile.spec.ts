import path from 'node:path';
import { EventEmitter } from 'node:events';

import fs from 'fs-extra';

import { createSpies } from '@zougui/common.jest-utils';

import { streamToFile } from './streamToFile';
import { tempDir } from './constants';

const uuid = 'erghiu-fgerijnouefg';

jest.mock('uuid', () => {
  return {
    v4: () => uuid
  }
});

describe('streamToFile()', () => {
  const spies = createSpies(() => ({
    fs: {
      ensureDir: jest.spyOn(fs, 'ensureDir'),
      pathExists: jest.spyOn(fs, 'pathExists'),
      unlink: jest.spyOn(fs, 'unlink'),
      createWriteStream: jest.spyOn(fs, 'createWriteStream'),
      rename: jest.spyOn(fs, 'rename'),
    },
  }));

  it('should write the stream into a temp file and remove it when an error occurs', async () => {
    const expectedTempFile = path.join(tempDir, uuid);
    const file = 'some/dir/file.json';
    const errorMessage = 'an error occured';
    const emitter = new EventEmitter();
    spies.fs.pathExists.mockImplementation(async () => true);
    spies.fs.createWriteStream.mockReturnValue(emitter as fs.WriteStream)

    const writeStream = await streamToFile(file);
    const promisedStream = new Promise((resolve, reject) => {
      writeStream.once('finish', resolve);
      writeStream.once('error', reject);
    });

    await new Promise(process.nextTick);

    expect(spies.fs.createWriteStream).toBeCalledTimes(1);
    expect(spies.fs.createWriteStream).toBeCalledWith(expectedTempFile);
    expect(spies.fs.ensureDir).toBeCalledTimes(1);
    expect(spies.fs.ensureDir).toBeCalledWith(tempDir);
    // the callback has not fulfilled yet so the unlink is not called yet
    expect(spies.fs.unlink).not.toBeCalled();

    emitter.emit('error', new Error(errorMessage));
    await new Promise(process.nextTick);

    expect(spies.fs.unlink).toBeCalledTimes(1);
    expect(spies.fs.unlink).toBeCalledWith(expectedTempFile);
    expect(spies.fs.rename).not.toBeCalled();

    // ensures that the promise returned by `streamToFile` actually resolves
    expect(() => promisedStream).rejects.toThrowError(errorMessage);
  });

  it('should write the stream into a temp file and rename it to the wanted file when the stream finishes', async () => {
    const expectedTempFile = path.join(tempDir, uuid);
    const file = 'some/dir/file.json';
    const emitter = new EventEmitter();
    spies.fs.pathExists.mockImplementation(async () => true);
    spies.fs.createWriteStream.mockReturnValue(emitter as fs.WriteStream)

    const writeStream = await streamToFile(file);
    const promisedStream = new Promise((resolve, reject) => {
      writeStream.once('finish', resolve);
      writeStream.once('error', reject);
    });

    await new Promise(process.nextTick);

    expect(spies.fs.createWriteStream).toBeCalledTimes(1);
    expect(spies.fs.createWriteStream).toBeCalledWith(expectedTempFile);
    expect(spies.fs.ensureDir).toBeCalledTimes(1);
    expect(spies.fs.ensureDir).toBeCalledWith(tempDir);
    // the callback has not fulfilled yet so the unlink is not called yet
    expect(spies.fs.unlink).not.toBeCalled();

    emitter.emit('finish');
    await new Promise(process.nextTick);

    expect(spies.fs.rename).toBeCalledTimes(1);
    expect(spies.fs.rename).toBeCalledWith(expectedTempFile, file);
    expect(spies.fs.unlink).not.toBeCalled();

    // ensures that the promise returned by `streamToFile` actually resolves
    await promisedStream;
  });
});
