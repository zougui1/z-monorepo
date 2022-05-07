import { prop, modelOptions } from '@typegoose/typegoose';
import type { PropType } from '@typegoose/typegoose';
import type {
  BasePropOptions,
  ArrayPropOptions,
  MapPropOptions,
  PropOptionsForNumber,
  PropOptionsForString,
  VirtualOptions,
} from '@typegoose/typegoose/lib/types';
import _ from 'lodash';

export const enumProp = (
  options: EnumPropOptions,
  kind?: PropType | undefined
): PropertyDecorator => {
  const enumValues = Object.values(options.enum);

  if (!enumValues.length) {
    throw new Error('The enum must have at least one value');
  }

  const enumType = enumValues[0].constructor;

  return prop({
    ...options,
    type: () => options.array ? [enumType] : enumType,
    enum: enumValues,
  }, kind);
}

export type EnumPropOptions = Omit<
  BasePropOptions | ArrayPropOptions | MapPropOptions | PropOptionsForNumber | PropOptionsForString | VirtualOptions,
  'type' | 'enum'
> & {
  enum: Record<string, string> | Record<string, number>;
  array?: boolean | undefined;
};

export const timestamps = (): ClassDecorator => {
  return modelOptions({ schemaOptions: { timestamps: true } });
}

export interface WithTimestamps {
  createdAt: Date;
  updatedAt: Date;
}

export type OmitTimestamps<T extends Record<string, any>> = Omit<T, 'createdAt' | 'updatedAt'>;
