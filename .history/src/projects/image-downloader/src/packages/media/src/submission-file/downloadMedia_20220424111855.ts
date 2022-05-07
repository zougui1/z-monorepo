import path from 'node:path';

import fs from 'fs-extra';
import * as uuid from 'uuid';

import { downloadFile } from '@zougui/common.fs-utils';

import { mediaDir } from './constants';

export const downloadMedia = async (url: string): Promise<string> => {
  const file = path.join(mediaDir, uuid.v4());
  await fs.ensureDir(mediaDir);
  await downloadFile(url, { file });

  return file;
}
