import { UnknownObject } from '@zougui/common.type-utils';

import type { NodeConfigType } from '../types';
import { nodeConfigSchema } from '../../schemas';

export const validatePublicConfig = (config: UnknownObject): NodeConfigType => {
  return nodeConfigSchema.validateSync(config, { abortEarly: false, strict: true });
}
