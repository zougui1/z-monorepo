import joi from 'joi';

import { PropertyRule } from '../PropertyRule';

export const IsBoolean = (options?: IsBooleanValidationOptions) => {
  return PropertyRule(rule => {
    return rule
      .setSchema(joi.boolean())
      .truthy(options?.truthy)
      .falsy(options?.falsy)
      .sensitive(options?.sensitive ?? false)
      .default(options?.default);
  });
}

export interface IsBooleanValidationOptions {
  falsy?: (string | number)[] | undefined;
  truthy?: (string | number)[] | undefined;
  /**
   * @default true
   */
  sensitive?: boolean | undefined;
  default?: boolean | undefined;
}
