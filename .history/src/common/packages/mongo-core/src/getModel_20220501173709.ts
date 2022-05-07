import { getType, Type } from 'tst-reflect';
import { getModelForClass } from '@typegoose/typegoose';
import type { AnyParamConstructor, IModelOptions, ReturnModelType } from '@typegoose/typegoose/lib/types';
import mongoose from 'mongoose';
import type { Constructor } from 'type-fest';

import type { AnyObject } from '@zougui/common.type-utils';
import { isThenable } from '@zougui/common.promise-utils';

import { Prop } from './decorators';


export const getModel = <U extends AnyParamConstructor<any>, QueryHelpers = AnyObject>(cl: U, options?: IModelOptions | undefined): ReturnModelType<U, QueryHelpers> => {
  const BasicModel = getModelForClass<U, QueryHelpers>(cl, options);

  return BasicModel;
}
