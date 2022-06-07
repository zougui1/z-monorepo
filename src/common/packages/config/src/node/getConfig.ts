import type { ReadonlyDeep } from 'type-fest';

import { readConfigSync } from './config-readers';
import { parseFileReferences, parseEnvVariables } from './config-enhancers';
import { validatePublicConfig } from './config-validators';
import { configDir } from './constants';
import type { ConfigType } from './types';
import { enhanceFullConfig } from '../common';

export const getConfig = (options?: GetConfigOptions | undefined): ReadonlyDeep<ConfigType> => {
  const config = readConfigSync();

  const fullConfig = parseFileReferences(configDir, config);
  const configWithEnvVars = parseEnvVariables(fullConfig);

  const publicConfig = enhanceFullConfig(configWithEnvVars, {
    ...(options || {}),
    allowedEnv: 'node',
  });
  const validPublicConfig = validatePublicConfig(publicConfig);

  return validPublicConfig as ConfigType;
}

export interface GetConfigOptions {
  /**
   *  @default true
   */
  protect?: boolean | undefined;
}
