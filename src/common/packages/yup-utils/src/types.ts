import type { AnyObjectSchema, InferType } from 'yup';

export type InferKeys<T extends AnyObjectSchema> = keyof InferType<T>;
