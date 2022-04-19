import joi from 'joi';

import { PropertyRule } from '../PropertyRule';

export const IsNumber = (options?: IsNumberValidationOptions) => {
  return PropertyRule(rule => {
    return rule
      .setSchema(joi.number())
      .precision(options?.precision)
      .unsafe(options?.unsafe ?? false)
      .default(options?.default);
  });
}

export interface IsNumberValidationOptions {
  precision?: number | undefined;
  /**
   * @default false
   */
   unsafe?: boolean | undefined;
  default?: boolean | undefined;
}

export const IsInteger = (options?: IsIntegerValidationOptions) => {
  return PropertyRule(rule => {
    return rule
      .setSchema(joi.number().integer())
      .unsafe(options?.unsafe ?? false)
      .default(options?.default);
  });
}

export interface IsIntegerValidationOptions {
  /**
   * @default false
   */
   unsafe?: boolean | undefined;
  default?: boolean | undefined;
}

export const IsPort = (options?: IsPortValidationOptions) => {
  return PropertyRule(rule => {
    return rule
      .setSchema(joi.number().port())
      .default(options?.default);
  });
}

export interface IsPortValidationOptions {
  default?: boolean | undefined;
}

export const IsNegative = () => {
  return PropertyRule(rule => rule.sign('negative'));
}

export const IsPositive = () => {
  return PropertyRule(rule => rule.sign('positive'));
}

export const Sign = (sign: 'positive' | 'negative') => {
  return PropertyRule(rule => rule.sign(sign));
}
