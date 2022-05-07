import { Type } from 'tst-reflect';

import { getModelForClass } from '@typegoose/typegoose';
import type { AnyParamConstructor, IModelOptions, ReturnModelType } from '@typegoose/typegoose/lib/types';

import type { AnyObject } from '@zougui/common.type-utils';

import { Prop } from './decorators';

export const getModel = <U extends AnyParamConstructor<any>, QueryHelpers = AnyObject>(cl: U, options?: IModelOptions | undefined): ReturnModelType<U, QueryHelpers> => {
  const types = Reflect.getMetadata('tst-reflect:type', cl) as { type: Type; target: Object; propName: string; useAdvancedReflection: boolean }[];
  console.log(types);

  for (const { type, target, propName, useAdvancedReflection } of types) {
    if (!useAdvancedReflection) {
      continue;
    }

    if (type.isClass()) {
      type.getCtor().then(constructor => {
        Prop({ type: () => constructor })(target, propName);
      });
    }
  }

  const model = getModelForClass<U, QueryHelpers>(cl, options);
  return model;
}
