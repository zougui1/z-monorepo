import path from 'node:path';

import env from '@zougui/common.env/node';

export const downloadDir = path.join(env.APP_WORKSPACE, 'downloads');
