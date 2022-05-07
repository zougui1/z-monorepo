import type {
  BasePropOptions,
  ArrayPropOptions,
  MapPropOptions,
  PropOptionsForNumber,
  PropOptionsForString,
  VirtualOptions,
} from '@typegoose/typegoose/lib/types';

export type PropOptions = (
  | BasePropOptions
  | ArrayPropOptions
  | MapPropOptions
  | PropOptionsForNumber
  | PropOptionsForString
  | VirtualOptions
);

export type {
  BasePropOptions,
  ArrayPropOptions,
  MapPropOptions,
  PropOptionsForNumber,
  PropOptionsForString,
  VirtualOptions,
}
