import path from 'node:path';

const reNodeModules = /\/node_modules\/.*/;

const mainFile = require.main?.filename
  ? path.dirname(path.dirname(require.main.filename))
  : '';

export const ROOT = mainFile && !mainFile.includes('/node/')
  ? mainFile.includes('node_modules')
    ? mainFile.replace(reNodeModules, '')
    : mainFile
  : process.cwd();
