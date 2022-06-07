import * as yup from 'yup';

export const passwordSchema = yup.string().min(8).max(1024);

export type { } from 'yup/lib/types';
export type { } from 'yup/lib/string';
