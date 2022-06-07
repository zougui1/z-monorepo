import { isObject } from '@zougui/common.object-utils';
import type { UnknownObject } from '@zougui/common.type-utils';

import { envVariants } from '../constants';

const reEnvVariants = new RegExp(`^(${envVariants.join('|')}):`);

export const stripEnvFields = (config: UnknownObject, options?: StripEnvFieldsOptions | undefined): UnknownObject => {
  const protectedConfig = Object.entries(config).reduce((strippedConfig, [key, value]) => {
    if (!reEnvVariants.test(key) || (options?.allowedEnv && key.startsWith(options?.allowedEnv))) {
      strippedConfig[key.replace(reEnvVariants, '')] = isObject(value)
        ? stripEnvFields(value as UnknownObject, options)
        : value;
    }

    return strippedConfig;
  }, {} as UnknownObject);

  return protectedConfig;
}

export interface StripEnvFieldsOptions {
  allowedEnv?: string | undefined;
}
