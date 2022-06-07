import type { UnknownObject } from '@zougui/common.type-utils';
import env from '@zougui/common.env';

import { reactAppPrefix, keysNamespace } from '../constants';

export const getFlatConfigFromEnv = (): UnknownObject => {
  const envVars = env.isCommonJs
    ? process.env
    // @ts-ignore
    : import.meta.env;

  const config = Object
    // @ts-ignore
    .entries(envVars)
    .filter(([key]) => key.startsWith(reactAppPrefix))
    .reduce((config, [key, value]) => {
      const actualKey = key.replace(reactAppPrefix, '').replace(keysNamespace, '');
      const actualValue = value ? JSON.parse(value as any) : value;

      config[actualKey] = actualValue;

      return config;
    }, {} as Record<string, string | undefined>);

  return config;
}
