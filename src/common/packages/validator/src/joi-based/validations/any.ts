import type { ValidationOptions } from 'joi';

import { PropertyRule } from '../PropertyRule';
import { ClassMetadata } from '../ClassMetadata';

export const IsOptional = () => {
  return PropertyRule(rule => rule.optional());
}

export const IsRequired = () => {
  return PropertyRule(rule => rule.required());
}

export const IsStrict = () => {
  return PropertyRule(rule => rule.strict());
}

export const Strip = () => {
  return PropertyRule(rule => rule.strip());
}

export const Options = (options: ValidationOptions) => {
  return ClassMetadata(builder => builder.setOptions(options));
}
