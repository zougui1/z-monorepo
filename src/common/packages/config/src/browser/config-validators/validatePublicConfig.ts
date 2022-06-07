import { UnknownObject } from '@zougui/common.type-utils';

import type { ConfigType } from '../types';
import { browserConfigSchema } from '../../schemas';

export const validatePublicConfig = (config: UnknownObject): ConfigType => {
  return browserConfigSchema.validateSync(config, { abortEarly: false, strict: true });
}
