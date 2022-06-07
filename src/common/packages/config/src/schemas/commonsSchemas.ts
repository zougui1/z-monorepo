import * as yup from 'yup';

import { url } from '@zougui/common.yup-utils';
//import * as ms from '@zougui/common.ms';
export const reDurationString = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i;

export const portNumberSchema = yup.number().min(1).max(65_535);

export const durationSchema = yup.string().matches(reDurationString, ({ path }) => `${path} must be a duration string`);

export const databaseSchema = yup.object({
  name: yup.string().min(3).required(),
  host: yup.string().optional(),
  port: portNumberSchema.optional(),
  username: yup.string().min(3).optional(),
  password: yup.string().min(4).optional(),
  envSuffix: yup.boolean().optional(),
}).noUnknown();

export const corsAllowedHeadersSchema = yup.array(yup.string().required());
export const corsCredentialsSchema = yup.boolean();
export const corsMethodsSchema = yup.array(yup.string().required());

export const corsSchema = yup.object({
  allowedHeaders: corsAllowedHeadersSchema.required(),
  credentials: corsCredentialsSchema,
  methods: corsMethodsSchema.required(),
  origin: yup.array(yup.string().required()).required(),
});

export const apiServerSchema = yup.object({
  port: portNumberSchema.required(),
  url: url({ requireTld: false }).required(),
  cors: corsSchema.required(),
}).noUnknown();

// fix type inference errors
export {} from 'yup/lib/types';
export {} from 'yup/lib/array';
export {} from 'yup/lib/object';
export {} from 'yup/lib/string';
export {} from 'yup/lib/number';
export {} from 'yup/lib/boolean';
