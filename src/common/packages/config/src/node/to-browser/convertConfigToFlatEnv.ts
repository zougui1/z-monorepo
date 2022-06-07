import flatten from 'flat';

import { UnknownObject } from '@zougui/common.type-utils';

import { keysNamespace } from '../../browser/constants';

export const convertConfigToFlatEnv = (config: UnknownObject): Record<string, string | undefined> => {
  const flatObject = flatten(config) as UnknownObject;

  const flatConfig = Object.entries(flatObject).reduce((flatConfig, [key, value]) => {
    flatConfig[`${keysNamespace}${key}`] = JSON.stringify(value);
    return flatConfig;
  }, {} as Record<string, string>);

  return flatConfig
}
