import crypto from 'node:crypto';

import type { SaltOptions } from '../types';
import { toBuffer } from '../../../common';

export const getSalt = (options: SaltOptions): Buffer | undefined => {
  if (options.salt) {
    return toBuffer(options.salt);
  }

  if (options.saltLength) {
    return crypto.randomBytes(options.saltLength);
  }
}
