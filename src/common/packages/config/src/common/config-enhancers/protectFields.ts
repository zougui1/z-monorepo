import { isObject } from '@zougui/common.object-utils';
import type { UnknownObject } from '@zougui/common.type-utils';

import { protectedFieldPrefix } from '../constants';

export const protectFields = (config: UnknownObject): UnknownObject => {
  const configEntries = Object.entries(config);

  const protectedConfig = configEntries.reduce((protectedConfig, [key, value]) => {
    if (key.startsWith(protectedFieldPrefix)) {
      Object.defineProperty(protectedConfig, key, {
        configurable: false,
        enumerable: false,
        writable: false,
        value,
      });
    } else {
      Object.defineProperty(protectedConfig, key, {
        enumerable: true,
        configurable: false,
        writable: false,
        value: isObject(value)
          ? protectFields(value as UnknownObject)
          : value,
      });
    }

    return protectedConfig;
  }, {} as UnknownObject);

  return protectedConfig;
}
