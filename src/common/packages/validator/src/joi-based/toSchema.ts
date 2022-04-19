import type { Constructor } from 'type-fest';

import { schemaCache } from './schemaCache';
import type { Schema } from './types';

export const toSchema = <T extends Constructor<unknown>>(object: T): Schema<InstanceType<T>> => {
  const schemaBuilder = schemaCache.find<InstanceType<T>>(object);

  if (!schemaBuilder) {
    throw new Error('Only schema classes can be converted into a schema.');
  }

  return schemaBuilder.getSchema();
}
