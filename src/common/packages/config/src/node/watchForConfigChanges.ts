import path from 'node:path';

import chokidar from 'chokidar';

import { configDir } from './constants';

const configFilesPattern = path.join(configDir, '**/*.json');

export const watchForConfigChanges = (listener: (path: String) => void): void => {
  chokidar
    .watch(configFilesPattern, { ignoreInitial: true })
    .on('change', listener);
}
