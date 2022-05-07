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
  return function PropDecorator(target: Object, propertyKey: string | symbol): void {
    const type = Reflect.getMetadata('design:type', target, propertyKey);
    const required = options?.required ?? true;

    prop({
      ...(options || {}),
      required,
    }, kind)(target, propertyKey);
  }
}

export type PropOptions = (
  | BasePropOptions
  | ArrayPropOptions
  | MapPropOptions
  | PropOptionsForNumber
  | PropOptionsForString
  | VirtualOptions
);
