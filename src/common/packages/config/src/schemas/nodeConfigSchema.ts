import * as yup from 'yup';

import { databaseSchema, apiServerSchema, durationSchema } from './commonsSchemas';
import { privateLoggerSchema } from './privateConfigSchema';

//#region media downloader
export const nodeMediaSchema = yup.object({
  apiServer: apiServerSchema.required(),
  database: databaseSchema.required(),

  furaffinity: yup.object({
    _cookieA: yup.string().required(),
    _cookieB: yup.string().required(),
  }).noUnknown().required(),

  fs: yup.object({
    mediaDir: yup.string().required(),
    mediaVariantsDir: yup.string().required(),
  }).noUnknown().required(),
}).noUnknown();
//#endregion

//#region logger
export const nodeLogSchema = yup.object({
  apiServer: apiServerSchema.required(),
  database: databaseSchema.required(),
  logger: privateLoggerSchema.required(),
}).noUnknown();
//#endregion

//#region auth
export const nodeAuthSchema = yup.object({
  apiServer: apiServerSchema.required(),
  session: yup.object({
    cookieName: yup.string().required(),
    duration: durationSchema.required(),
    secrets: yup.array(yup.string().required()).min(1).required(),
  }).noUnknown().required(),
  database: databaseSchema.required(),
}).noUnknown();
//#endregion

//#region crypto
export const nodeCryptoSchema = yup.object({
  hash: yup.object({
    node: yup.object({
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

export const nodeConfigSchema = yup.object({
  media: nodeMediaSchema.required(),
  log: nodeLogSchema.required(),
  auth: nodeAuthSchema.required(),
  crypto: nodeCryptoSchema.required(),
}).noUnknown();

// fix type inference errors
export {} from 'yup/lib/types';
export {} from 'yup/lib/array';
export {} from 'yup/lib/object';
export {} from 'yup/lib/string';
export {} from 'yup/lib/number';
export {} from 'yup/lib/boolean';
