import path from 'node:path';

import _ from 'lodash';

import { UnknownObject } from '@zougui/common.type-utils';

import { readConfigFilesSync } from './readConfigFilesSync';

export const readConfigFileSync = (filePath: string): unknown => {
  const configs = readConfigFilesSync(filePath);
  const config = _.merge({}, configs.common, configs.env);

  const configWithRefs = Object.entries(config).reduce((configWithRefs, [key, value]) => {
    if (key.startsWith('$')) {
      if (typeof value !== 'string') {
        throw new Error(`The config file reference for "${key}" must be a string (file path). Got: ${value}`);
      }

      const subConfigFile = path.isAbsolute(value)
        ? value
        : path.join(path.dirname(filePath), value);

      configWithRefs[key.slice(1)] = readConfigFileSync(subConfigFile);
    } else {
      configWithRefs[key] = value;
    }

    return configWithRefs;
  }, {} as UnknownObject);

  return configWithRefs;
}
