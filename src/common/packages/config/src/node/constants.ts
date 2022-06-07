import path from 'node:path';

import env from '@zougui/common.env/node';

export const configDir = path.join(env.WORKSPACE, 'config');
export const fileReferencePrefix = '$';
export const envVar = {
  prefix: 'env',
  start: '(',
  end: ')',
};
