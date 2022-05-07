import { getType } from 'tst-reflect';

import { Prop } from './Prop';

/**
 * @reflect
 */
//export function SuperProp() {
  /**
   * @reflect
   */
  export function SuperProp<T extends Object>(target: T, propName: string | symbol) {
    const type = getType<T>();
    console.log(type)
    const basicType = Reflect.getMetadata('design:type', target, propName);
    const types = Reflect.getMetadata('tst-reflect:type', target) || [];
    const newTypes = [
      ...types,
      { type, target, propName, useAdvancedReflection: basicType === Object },
    ];
    Reflect.metadata('tst-reflect:type', newTypes)(target as any);

    Prop()(target, propName);
  }
//}