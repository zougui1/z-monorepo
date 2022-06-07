import type { ReadonlyDeep } from 'type-fest';

import { readConfigSync } from '../config-readers';
import { parseFileReferences } from '../config-enhancers';
import { configDir } from '../constants';
import { validatePublicConfig } from '../../browser/config-validators';
import type { ConfigType } from '../../browser';
import { enhanceFullConfig } from '../../common';

export const getConfig = (): ReadonlyDeep<ConfigType> => {
  const config = readConfigSync();

  const fullConfig = parseFileReferences(configDir, config);
  const publicConfig = enhanceFullConfig(fullConfig, {
    protect: false,
    allowedEnv: 'browser',
  });
  const validPublicConfig = validatePublicConfig(publicConfig);

  return validPublicConfig;
}
