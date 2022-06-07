import * as yup from 'yup';

import { apiServerSchema } from './commonsSchemas';
import { privateLoggerSchema } from './privateConfigSchema';

//#region media downloader
export const browserMediaSchema = yup.object({
  apiServer: apiServerSchema.required(),
}).noUnknown();
//#endregion

//#region logger
export const browserLogSchema = yup.object({
  apiServer: apiServerSchema.required(),
  logger: privateLoggerSchema.required(),
}).noUnknown();
//#endregion

//#region auth
export const browserIdentitySchema = yup.object({
  apiServer: apiServerSchema.required(),
}).noUnknown();
//#endregion

//#region crypto
export const browserCryptoSchema = yup.object({
  hash: yup.object({

  }).noUnknown().required(),
}).noUnknown();
//#endregion

export const browserConfigSchema = yup.object({
  media: browserMediaSchema.required(),
  log: browserLogSchema.required(),
  auth: browserIdentitySchema.required(),
  crypto: browserCryptoSchema.required(),
}).noUnknown();

// fix type inference errors
export {} from 'yup/lib/types';
export {} from 'yup/lib/array';
export {} from 'yup/lib/object';
export {} from 'yup/lib/string';
export {} from 'yup/lib/number';
export {} from 'yup/lib/boolean';
