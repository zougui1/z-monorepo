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
): Promise<InferType<Schema> & InferType<typeof headersSchema>> => {
  const validatedHeaders = schema
    ? await schema.validate(headers)
    : headers;

  return await headersSchema.validate(validatedHeaders);
}

export type { AnyObject } from 'yup/lib/types';
export type { RequiredStringSchema } from 'yup/lib/string';
export type { RequiredObjectSchema } from 'yup/lib/object';
