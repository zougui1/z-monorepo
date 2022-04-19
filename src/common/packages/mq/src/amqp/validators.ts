import type { AnyObjectSchema, InferType } from 'yup';

import { headersSchema } from './internal-schemas';

export const validateBody = async <Schema extends AnyObjectSchema>(
  body: unknown,
  schema: Schema | undefined,
): Promise<InferType<Schema>> => {
  return schema
    ? await schema.validate(body, { stripUnknown: true })
    : body;
}

export const validateHeaders = async <Schema extends AnyObjectSchema>(
  headers: unknown,
  schema: Schema | undefined,
): Promise<InferType<Schema>> => {
  const validatedHeaders = schema
    ? await schema.validate(headers)
    : headers;

  return await headersSchema.validate(validatedHeaders);
}
