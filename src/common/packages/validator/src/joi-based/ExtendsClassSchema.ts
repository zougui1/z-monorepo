import type { Constructor } from 'type-fest';

import { schemaCache } from './schemaCache';

export const ExtendsClassSchema = (getClassSchema: (() => Constructor<object>)) => {
  return function (constructor: Constructor<object>) {
    const schemaBuilder = schemaCache.find(getClassSchema());

    if (!schemaBuilder) {
      throw new Error('Can extend only from schema classes');
    }

    schemaCache.set(constructor, schemaBuilder.clone());
  }
}
