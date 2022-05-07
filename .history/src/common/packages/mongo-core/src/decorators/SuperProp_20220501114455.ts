import { getType } from 'tst-reflect';

import { Prop } from './Prop';

/**
 * @reflect
 */
export const SuperProp = (): PropertyDecorator => {
  return function SuperPropDecorator<T extends Object>(target: T, propName: string | symbol) {
    const type = getType<T>();
    Reflect.metadata('tst-reflect:type', { type, target, propName })(target, propName);
    Prop()(target, propName);
  }
}
