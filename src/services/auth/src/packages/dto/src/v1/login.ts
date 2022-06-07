import * as yup from 'yup';

import { passwordSchema } from './common';
import { authenticatedUserSchema } from './user';

export const loginBodySchema = yup.object({
  email: yup.string().email().required(),
  password: passwordSchema.required(),
  userAgent: yup.string().required(),
}).noUnknown().required();
export type LoginBody = yup.InferType<typeof loginBodySchema>;

export const loginResponseSchema = authenticatedUserSchema;
export type LoginResponse = yup.InferType<typeof loginResponseSchema>;

export type { } from 'yup/lib/types';
export type { } from 'yup/lib/array';
export type { } from 'yup/lib/string';
export type { } from 'yup/lib/object';
