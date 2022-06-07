import path from 'node:path';

import env from '@zougui/common.env/node';
import { UnknownObject } from '@zougui/common.type-utils';

import { readAngMergeConfigsSync } from './readAngMergeConfigsSync';

export const readConfigFilesSync = (configPath: string): UnknownObject => {
  const configDir = path.dirname(configPath);
  const configFullFileName = path.basename(configPath);
  const [configFileName, configFileExtension] = configFullFileName.split('.');

  const envConfigFullFileName = `${configFileName}.${env.NODE_ENV}.${configFileExtension}`;
  const envConfigPath = path.join(configDir, envConfigFullFileName);

  return readAngMergeConfigsSync({
    common: configPath,
    env: envConfigPath,
  });
}
