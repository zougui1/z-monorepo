import path from 'node:path';

import _ from 'lodash';

import { UnknownObject } from '@zougui/common.type-utils';

import { readConfigFilesSync } from '../config-readers';
import { fileReferencePrefix } from '../constants';

export const parseFileReferences = (dir: string, config: UnknownObject): UnknownObject => {
  const configWithRefs = Object.entries(config).reduce((configWithRefs, [key, filePath]) => {
    if (key.startsWith(fileReferencePrefix)) {
      if (typeof filePath !== 'string') {
        throw new Error(`The config file reference for "${key}" must be a string (file path). Got: ${filePath}`);
      }

      const subConfigFile = path.isAbsolute(filePath)
        ? filePath
        : path.join(dir, filePath);
      const subConfigDir = path.dirname(subConfigFile);

      configWithRefs[key.slice(1)] = parseFileReferences(subConfigDir, readConfigFilesSync(subConfigFile));
    } else {
      configWithRefs[key] = filePath;
    }

    return configWithRefs;
  }, {} as UnknownObject);

  return configWithRefs;
}
