import { prop, PropType } from '@typegoose/typegoose';

import type { PropOptions } from './types';

export const Prop = (options?: PropOptions | undefined, kind?: PropType | undefined): PropertyDecorator => {
  const required = options?.required ?? true;

  return prop({
    ...(options || {}),
    required,
  }, kind);
}
