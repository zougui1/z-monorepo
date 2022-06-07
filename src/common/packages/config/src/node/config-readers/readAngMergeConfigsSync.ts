import _ from 'lodash';

import { UnknownObject } from '@zougui/common.type-utils';

import { readJsonObjectSync } from './readJsonObjectSync';

export const readAngMergeConfigsSync = (configPaths: { common: string; env: string }): UnknownObject => {
  const commonConfigResult = readJsonObjectSync(configPaths.common);
  const envConfigResult = readJsonObjectSync(configPaths.env);

  if (!commonConfigResult.exists && !envConfigResult.exists) {
    throw new Error(`Config not found at path "${configPaths.common}" nor at its environment counterpart at path "${configPaths.env}"`);
  }

  const config = _.merge({}, commonConfigResult.object, envConfigResult.object);

  return config;
}
