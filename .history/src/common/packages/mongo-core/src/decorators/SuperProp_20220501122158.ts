import { getType } from 'tst-reflect';

import { Prop } from './Prop';

/**
 * @reflect
 */
export function SuperProp(): PropertyDecorator {

  return function SuperPropDecorator<T>(target, propName: string | symbol) {
    const type = getType<T>();
    console.log(type)
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
