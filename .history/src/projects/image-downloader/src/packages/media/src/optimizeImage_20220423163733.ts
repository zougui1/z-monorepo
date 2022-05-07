import path from 'node:path';

import { makeMultiImagePreviews } from '@zougui/common.fs-utils';
import env from '@zougui/common.env/node';

export const optimizeImage = async (filePath: string) => {
  const dir = path.join(env.APP_WORKSPACE, 'downloads/variants');

  return await makeMultiImagePreviews(filePath, {
    destDir: dir,
    widths: [200, '50%', '70%'],
    formats: ['original', 'avif', 'webp'],
  });
}
