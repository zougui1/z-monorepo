import path from 'node:path';

import env from '@zougui/common.env/node';
import type { UnknownObject } from '@zougui/common.type-utils';

import { readAngMergeConfigsSync } from './readAngMergeConfigsSync';
import { configDir } from '../constants';

export const readConfigSync = (): UnknownObject => {
  const commonConfigFile = path.join(configDir, 'common.json');
  const envConfigFile = path.join(configDir, `${env.NODE_ENV}.json`);

  const config = readAngMergeConfigsSync({
    common: commonConfigFile,
    env: envConfigFile,
  });

  return config;
}
