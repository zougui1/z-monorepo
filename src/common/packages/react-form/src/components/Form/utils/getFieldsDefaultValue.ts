import { isSchema, AnyObjectSchema } from 'yup';

import type { UnknownObject } from '@zougui/common.type-utils';

const typesDefaultValueMap = Object.freeze<UnknownObject>({
  array: [],
  string: '',
  boolean: false,
  date: null,
  number: 0,
});

export const getFieldsDefaultValue = <T extends AnyObjectSchema>(schema: T): UnknownObject => {
  const description = schema.describe();

  const defaultValues = Object.entries(description.fields).reduce((defaultValues, [name, description]) => {
    const fieldSchema = schema.fields?.[name];

    // get the default value from the schema if available
    const schemaDefaultValue = isSchema(fieldSchema) && 'spec' in fieldSchema ? (fieldSchema.spec.default as number) : undefined;
    // use the default value from the schema if it exists
    // otherwise use a pre - defined default value based on the field's type
    const defaultFieldValue = schemaDefaultValue !== undefined ? schemaDefaultValue : typesDefaultValueMap[description.type];

    defaultValues[name] = defaultFieldValue;
    return defaultValues;
  }, {} as any);

  return defaultValues;
}
