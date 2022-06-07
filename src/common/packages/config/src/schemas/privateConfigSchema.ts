import * as yup from 'yup';

import { url } from '@zougui/common.yup-utils';

import {
  databaseSchema,
  apiServerSchema,
  corsAllowedHeadersSchema,
  corsCredentialsSchema,
  corsMethodsSchema,
  durationSchema,
} from './commonsSchemas';

//#region private vars
const privateVarsSchema = yup.object({
  localIp: yup.string().required(),
  workspace: yup.string().required(),
  appWorkspace: yup.string().required(),

  cors: yup.object({
    allowedHeaders: corsAllowedHeadersSchema.required(),
    credentials: corsCredentialsSchema,
    methods: corsMethodsSchema.required(),
  }),
}).noUnknown();
//#endregion

//#region media downloader
export const privateMediaSchema = yup.object({
  apiServer: apiServerSchema.required(),
  'node:database': databaseSchema.required(),

  'node:furaffinity': yup.object({
    _cookieA: yup.string().required(),
    _cookieB: yup.string().required(),
  }).noUnknown().required(),

  'node:fs': yup.object({
    mediaDir: yup.string().required(),
    mediaVariantsDir: yup.string().required(),
  }).noUnknown().required(),
}).noUnknown();
//#endregion

//#region logger
export const privateLoggerSchema = yup.object({
  loggers: yup.array().of(yup.string().defined()).required(),

  http: yup.object({
    logUrl: url({ requireTld: false }).required(),
    batch: yup.object({
      interval: yup.string().required(),
    }).noUnknown().required(),
  }).noUnknown().required(),
}).noUnknown();

export const privateLogSchema = yup.object({
  apiServer: apiServerSchema.required(),
  'node:database': databaseSchema.required(),
  logger: privateLoggerSchema.required(),
}).noUnknown();
//#endregion

//#region auth
export const privateAuthSchema = yup.object({
  apiServer: apiServerSchema.required(),
  'node:session': yup.object({
    cookieName: yup.string().required(),
    duration: durationSchema.required(),
    secrets: yup.array(yup.string().required()).min(1).required(),
  }).noUnknown().required(),
  'node:database': databaseSchema.required(),
}).noUnknown();
//#endregion

//#region crypto
export const privateCryptoSchema = yup.object({
  hash: yup.object({
    'node:node': yup.object({
      v1: yup.object({
        driver: yup.string().required(),
        variant: yup.string().required(),
        iterations: yup.number().min(1).required(),
        memory: yup.number().min(1024).required(),
        parallelism: yup.number().min(1).required(),
        saltLength: yup.number().min(1).max(16).required(),
        secrets: yup.array(yup.string().min(32).required()).min(1).required(),
      }).noUnknown().required(),
    }).noUnknown().required(),
  }).noUnknown().required(),
}).noUnknown();
//#endregion

export const privateConfigSchema = yup.object({
  '#vars': privateVarsSchema.required(),
  media: privateMediaSchema.required(),
  log: privateLogSchema.required(),
  auth: privateAuthSchema.required(),
  crypto: privateCryptoSchema.required(),
}).noUnknown();

// fix type inference errors
export {} from 'yup/lib/types';
export {} from 'yup/lib/array';
export {} from 'yup/lib/object';
export {} from 'yup/lib/string';
export {} from 'yup/lib/number';
export {} from 'yup/lib/boolean';
