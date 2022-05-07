import _ from 'lodash';
import type { PropType } from '@typegoose/typegoose';

import { Prop } from './Prop';
import type { PropOptions } from './types';

export const EnumProp = (
  options: EnumPropOptions,
  kind?: PropType | undefined
): PropertyDecorator => {
  const enumValues = Object.values(options.enum);

  if (!enumValues.length) {
    throw new Error('The enum must have at least one value');
  }

  const enumType = enumValues[0].constructor;

  return Prop({
    ...options,
    type: () => options.array ? [enumType] : enumType,
    enum: enumValues,
  }, kind);
}

export type EnumPropOptions = Omit<PropOptions, 'type' | 'enum'> & {
  enum: Record<string, string> | Record<string, number>;
  array?: boolean | undefined;
}
