import * as yup from 'yup';

export const authenticatedUserSchema = yup.object({
  name: yup.string().required(),
  email: yup.string().email().required(),
  sessions: yup.array(yup.string().required()).required(),
  platforms: yup.array(yup.string().required()).required(),
}).noUnknown().required();

export type { } from 'yup/lib/types';
export type { } from 'yup/lib/array';
export type { } from 'yup/lib/string';
export type { } from 'yup/lib/object';
