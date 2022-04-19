import path from 'node:path';
import fs from 'node:fs/promises';

import { forEachSpy } from './forEachSpy';

describe('forEachSpy()', () => {
  it('should call the callback for every spy', () => {
    const callback = jest.fn().mockName('callback');
    const spies = {
      fs: {
        writeFile: jest.spyOn(fs, 'writeFile'),
        readFile: jest.spyOn(fs, 'readFile'),
        unlink: jest.spyOn(fs, 'unlink'),
      },
      path: {
        join: jest.spyOn(path, 'join'),
        resolve: jest.spyOn(path, 'resolve'),
      },
    };

    forEachSpy(spies, callback);

    expect(callback).toBeCalledTimes(5);
    expect(callback).toBeCalledWith(spies.fs.writeFile);
    expect(callback).toBeCalledWith(spies.fs.readFile);
    expect(callback).toBeCalledWith(spies.fs.unlink);
    expect(callback).toBeCalledWith(spies.path.join);
    expect(callback).toBeCalledWith(spies.path.resolve);
  });
});
