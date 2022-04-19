import joi from 'joi';
import type { Constructor } from 'type-fest';

import { PropertyRule } from '../PropertyRule';

// TODO options 'min' and 'max' referring to the min and max numbers of keys required in the object

export const IsObject = (options?: IsObjectValidationOptions) => {
  return PropertyRule(rule => {
    return rule
      .setSchema(joi.object())
      .unknown(options?.allowUnknownProperties ?? false)
      .min(options?.min)
      .max(options?.max)
      .default(options?.default);
  });
}

export interface IsObjectValidationOptions {
  /**
   * @default false
   */
  allowUnknownProperties?: boolean | undefined;
  min?: number | undefined;
  max?: number | undefined;
  default?: boolean | undefined;
}

export const IsInstance = <T = unknown, Arguments extends unknown[] = any[]>(
  constructor: Constructor<T, Arguments>,
  options?: IsInstanceValidationOptions,
) => {
  return PropertyRule(rule => {
    return rule.setSchema(joi.object().instance(constructor, options?.name));
  });
}

export interface IsInstanceValidationOptions {
  /**
   * an alternate name to use in validation errors. This is useful when the constructor function does not have a name.
   */
  name?: string | undefined;
}

export const IsRegex = () => {
  return PropertyRule(rule => {
    return rule.setSchema(joi.object().regex());
  });
}
