import type { InferType } from 'yup';

import { UnknownObject } from '@zougui/common.type-utils';

import { privateConfigSchema } from '../../schemas';

export const validatePrivateConfig = (config: UnknownObject): InferType<typeof privateConfigSchema> => {
  return privateConfigSchema.validateSync(config, { abortEarly: false, strict: true });
}
