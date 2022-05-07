import { prop, PropType } from '@typegoose/typegoose';
import type {
  BasePropOptions,
  ArrayPropOptions,
  MapPropOptions,
  PropOptionsForNumber,
  PropOptionsForString,
  VirtualOptions,
} from '@typegoose/typegoose/lib/types';

export const Prop = (options?: PropOptions | undefined, kind?: PropType | undefined): PropertyDecorator => {
  const required = options?.required ?? true;

  return prop({
    ...(options || {}),
    required,
  }, kind);
}

export type PropOptions = (
  | BasePropOptions
  | ArrayPropOptions
  | MapPropOptions
  | PropOptionsForNumber
  | PropOptionsForString
  | VirtualOptions
);
