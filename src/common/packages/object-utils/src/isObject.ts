import { UnknownObject } from '@zougui/common.type-utils';

export const isObject = (value: unknown): value is UnknownObject => {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}
