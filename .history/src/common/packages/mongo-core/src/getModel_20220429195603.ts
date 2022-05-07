import { getModelForClass } from '@typegoose/typegoose';
import type { AnyParamConstructor, IModelOptions, ReturnModelType } from '@typegoose/typegoose/lib/types';

import { isThenable } from '@zougui/common.promise-utils';
import type { AnyObject } from '@zougui/common.type-utils';

export const getModel = <U extends AnyParamConstructor<any>, QueryHelpers = AnyObject>(cl: U, options?: IModelOptions | undefined): ReturnModelType<U, QueryHelpers> => {
  const model = getModelForClass<U, QueryHelpers>(cl, options);
  const autoConnect = Reflect.getMetadata('auto-connect', cl);
  console.log('autoConnect', autoConnect)

  if (!autoConnect) {
    return model;
  }

  const proxiedModel = new Proxy(model, {
    get(target, propName) {
      const prop = (target as any)[propName];

      if (typeof prop !== 'function') {
        return prop;
      }

      return (...args: any[]) => {
        const value = prop(...args);

        if (!isThenable(value)) {
          return value;
        }

        return autoConnect().then(() => value);
      }
    }
  });

  return proxiedModel;
}
