import _ from 'lodash';
import type { SnakeCasedProperties } from 'type-fest';

import type { UnknownObject } from '@zougui/common.type-utils';

export const snakeCaseProperties = <T extends UnknownObject>(obj: T): SnakeCasedProperties<T> => {
  const snakeCaseObj = Object.entries(obj).reduce((options, [key, value]) => {
    const snakeCaseKey = _.snakeCase(key).toLowerCase();
    (options as any)[snakeCaseKey] = value;

    return options;
  }, {} as SnakeCasedProperties<T>);

  return snakeCaseObj;
}

export type { SnakeCasedProperties, UnknownObject };
