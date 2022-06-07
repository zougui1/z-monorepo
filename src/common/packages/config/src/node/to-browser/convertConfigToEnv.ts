import { UnknownObject } from '@zougui/common.type-utils';

import { convertConfigToFlatEnv } from './convertConfigToFlatEnv';
import { reactAppPrefix } from '../../browser/constants';

export const convertConfigToEnv = (config: UnknownObject): void => {
  const flatConfig = convertConfigToFlatEnv(config);

  for (const [key, value] of Object.entries(flatConfig)) {
    process.env[`${reactAppPrefix}${key}`] = value;
  }
}
