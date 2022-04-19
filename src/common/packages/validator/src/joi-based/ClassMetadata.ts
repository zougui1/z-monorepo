import { schemaCache } from './schemaCache';
import type { MetadataSchemaBuilder } from './MetadataSchemaBuilder';

export const ClassMetadata = (defineMetadata: ((rule: MetadataSchemaBuilder) => void)) => {
  return function ClassMetadataDecorator(constructor: Function) {
    defineMetadata(schemaCache.get(constructor));
  }
}
