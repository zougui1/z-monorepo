import { MetadataSchemaBuilder } from './MetadataSchemaBuilder';

class SchemaCache {
  #schemas: Map<unknown, MetadataSchemaBuilder> = new Map();

  find<T = unknown>(value: unknown): MetadataSchemaBuilder<T> | undefined {
    if (this.#schemas.has(value)) {
      return this.#schemas.get(value) as MetadataSchemaBuilder<T> | undefined;
    }
  }

  get<T = unknown>(value: unknown): MetadataSchemaBuilder<T> {
    const existingSchemaBuilder = this.find<T>(value);

    if (existingSchemaBuilder) {
      return existingSchemaBuilder;
    }

    const newSchemaBuilder = new MetadataSchemaBuilder<T>();
    this.#schemas.set(value, newSchemaBuilder);

    return newSchemaBuilder;
  }

  set<T = unknown>(value: unknown, schemaBuilder: MetadataSchemaBuilder<T>): void {
    this.#schemas.set(value, schemaBuilder);
  }
}

export const schemaCache = new SchemaCache();
