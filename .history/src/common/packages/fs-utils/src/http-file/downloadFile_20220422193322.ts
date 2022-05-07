import path from 'node:path';

import axios from 'axios';
import fs from 'fs-extra';

import { streamToFile } from '../streams';

export const downloadFile = async (url: string, options: DownloadFileOptions): Promise<void> => {
  const { file, encodeUri = true } = options;
  await fs.ensureDir(path.dirname(file));

  const writeStream = await streamToFile(file);
  const waitStream = new Promise((resolve, reject) => {
    writeStream.once('finish', resolve);
    writeStream.once('error', reject);
  });

  const actualUrl = encodeUri ? encodeURI(url) : url;
  console.log({ actualUrl, url });

  const response = await axios
    .get(actualUrl, { responseType: 'stream' })
    .catch(error => {
      if (axios.isAxiosError(error) && error.code) {
        console.log(error.code);
      }
      return undefined;
    });

  response?.data.pipe(writeStream);
  await waitStream.finally(() => writeStream.removeAllListeners());
}

export interface DownloadFileOptions {
  file: string;
  /**
   * @default true
   */
  encodeUri?: boolean | undefined;
}
