import { getType } from 'tst-reflect';

import { Prop } from './Prop';

/**
 * @reflect
 */
export function SuperProp<T>(): PropertyDecorator {
  const type = getType<T>();

  return function SuperPropDecorator(target, propName: string | symbol) {
    const types = Reflect.getMetadata('tst-reflect:type', target.constructor) || [];
    const newTypes = [...types, { type, target, propName }];
    Reflect.metadata('tst-reflect:type', newTypes)(target.constructor);

    Prop()(target, propName);
  }
}
