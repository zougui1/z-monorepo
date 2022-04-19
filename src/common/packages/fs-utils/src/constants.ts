import path from 'node:path';

import env from '@zougui/common.env/node';

export const tempDir = path.join(env.WORKSPACE, 'temp');
