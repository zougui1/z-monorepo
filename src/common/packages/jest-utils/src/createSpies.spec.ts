import path from 'path';
import fs from 'fs/promises';

import { createSpies } from './createSpies';

describe('createSpies()', () => {
  const spies = createSpies(() => ({
    fs: {
      writeFile: jest.spyOn(fs, 'writeFile'),
      readFile: jest.spyOn(fs, 'readFile'),
      unlink: jest.spyOn(fs, 'unlink'),
    },
    path: {
      join: jest.spyOn(path, 'join'),
      resolve: jest.spyOn(path, 'resolve'),
    },
  }));

  it('should correctly spy the targeted functions', async () => {
    spies.fs.writeFile.mockResolvedValue(undefined);
    spies.fs.readFile.mockResolvedValue('data');
    spies.fs.unlink.mockResolvedValue(undefined);

    expect(spies.fs.writeFile).not.toBeCalled();
    expect(spies.fs.readFile).not.toBeCalled();
    expect(spies.fs.unlink).not.toBeCalled();
    expect(spies.path.join).not.toBeCalled();
    expect(spies.path.resolve).not.toBeCalled();

    await fs.writeFile('filePath', 'data');
    await fs.readFile('filePath', 'utf8');
    await fs.unlink('filePath');
    path.join('dir', 'fileName');
    path.resolve('dir', 'fileName');

    expect(spies.fs.writeFile).toBeCalledTimes(1);
    expect(spies.fs.writeFile).toBeCalledWith('filePath', 'data');
    expect(spies.fs.readFile).toBeCalledTimes(1);
    expect(spies.fs.readFile).toBeCalledWith('filePath', 'utf8');
    expect(spies.fs.unlink).toBeCalledTimes(1);
    expect(spies.fs.unlink).toBeCalledWith('filePath');
    expect(spies.path.join).toBeCalledTimes(1);
    expect(spies.path.join).toBeCalledWith('dir', 'fileName');
    expect(spies.path.resolve).toBeCalledTimes(1);
    expect(spies.path.resolve).toBeCalledWith('dir', 'fileName');

    // a V8 error occurs if they're not restored manually
    spies.fs.readFile.mockRestore();
    spies.fs.readFile.mockRestore();
    spies.fs.unlink.mockRestore();
    spies.path.join.mockRestore();
    spies.path.resolve.mockRestore();
  });
});
