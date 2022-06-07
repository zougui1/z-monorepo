import { unflatten } from 'flat';
import type { ReadonlyDeep } from 'type-fest';

import { UnknownObject } from '@zougui/common.type-utils';

import { getFlatConfigFromEnv } from './getFlatConfigFromEnv';
import { validatePublicConfig } from '../config-validators';
import type { ConfigType } from '../';

export const getConfig = (): ReadonlyDeep<ConfigType> => {
  const config = unflatten(getFlatConfigFromEnv()) as UnknownObject;

  if (!Object.keys(config).length) {
    throw new Error('The config is empty. Maybe you forgot to set config environment variables through "node/to-browser"');
  }

  const validPublicConfig = validatePublicConfig(config);

  return validPublicConfig;
}
