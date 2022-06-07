import { isObject } from '@zougui/common.object-utils';
import type { UnknownObject } from '@zougui/common.type-utils';

import { privateFieldPrefix } from '../constants';

export const removePrivateFields = (config: UnknownObject): UnknownObject => {
  const configWithoutPrivates = Object.entries(config).reduce((configWithoutPrivates, [key, value]) => {
    if (key.startsWith(privateFieldPrefix)) {
      return configWithoutPrivates;
    }

    configWithoutPrivates[key] = isObject(value)
      ? removePrivateFields(value as UnknownObject)
      : value;

    return configWithoutPrivates;
  }, {} as UnknownObject);

  return configWithoutPrivates;
}
