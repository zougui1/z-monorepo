import { getType } from 'tst-reflect';

import { Prop } from './Prop';

/**
 * @reflect
 */
export function SuperProp<T>(): PropertyDecorator {
  const type = getType<T>();

  return function SuperPropDecorator(target, propName: string | symbol) {
    Reflect.metadata('tst-reflect:type', { type, target, propName })(target, propName);
    Prop()(target, propName);
  }
}
