import path from 'node:path';

import env from '@zougui/common.env/node';

export const mediaDir = path.join(env.APP_WORKSPACE, 'medias');
export const mediaVariantsDir = path.join(mediaDir, 'variants');
