import { string, object } from 'yup';

const reVersion = /^v[0-9]+$/;

export const headersSchema = object({
  id: string().min(6).max(100).required(),
  publishedAt: string().required(),
  messageType: string().min(6).max(100).required(),
  version: string().matches(reVersion).required(),
});

//! used to export `headersSchema` without type inference error
export * from 'yup/lib/types';
export type { RequiredStringSchema } from 'yup/lib/string';
export type { AssertsShape } from 'yup/lib/object';
