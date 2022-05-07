import { getType } from 'tst-reflect';

import { Prop } from './Prop';

/**
 * @rflect
 */
/*export function SuperProp<T>(): PropertyDecorator {
  const type = getType<T>();
  console.log(type)

  return function SuperPropDecorator(target, propName: string | symbol) {
    const basicType = Reflect.getMetadata('design:type', target.constructor, propName);
    const types = Reflect.getMetadata('tst-reflect:type', target.constructor) || [];
    const newTypes = [
      ...types,
      { type, target, propName, useAdvancedReflection: basicType === Object },
    ];
    Reflect.metadata('tst-reflect:type', newTypes)(target.constructor);

    Prop()(target, propName);
  }
}
*/

export const SuperProp = (): PropertyDecorator => {
  return function SuperPropDecorator(target, propName: string | symbol) {
    const basicType = Reflect.getMetadata('design:type', target.constructor, propName);

    if (basicType === Object) {
      const properties = Reflect.getMetadata('custom-properties', target.constructor) || [];
      Reflect.metadata('custom-properties', [...properties, propName])(target.constructor);
    }

    Prop()(target, propName);
  }
}