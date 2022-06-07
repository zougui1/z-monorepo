import * as yup from 'yup';

import { passwordSchema } from './common';
import { authenticatedUserSchema } from './user';

export const signupBodySchema = yup.object({
  name: yup.string().min(3).max(128).required(),
  email: yup.string().email().required(),
  password: passwordSchema.required(),
  userAgent: yup.string().required(),
}).noUnknown().required();
export type SignupBody = yup.InferType<typeof signupBodySchema>;

export const signupResponseSchema = authenticatedUserSchema;
export type SignupResponse = yup.InferType<typeof signupResponseSchema>;

export type { } from 'yup/lib/types';
export type { } from 'yup/lib/array';
export type { } from 'yup/lib/string';
export type { } from 'yup/lib/object';
