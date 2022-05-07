import { getModelForClass } from '@typegoose/typegoose';
import type { AnyParamConstructor, IModelOptions, ReturnModelType } from '@typegoose/typegoose/lib/types';

import type { AnyObject } from '@zougui/common.type-utils';

export const getModel = <U extends AnyParamConstructor<any>, QueryHelpers = AnyObject>(cl: U, options?: IModelOptions | undefined): ReturnModelType<U, QueryHelpers> => {
  const model = getModelForClass<U, QueryHelpers>(cl, options);
  return model;
}
