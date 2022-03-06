import fs from 'fs-extra';

import { DOWNLOAD_RESULTS_FILE } from '../constants';
import { DownloadResults } from '../types'

export const getDownloadResults = async (): Promise<DownloadResults> => {
  return await fs.readJson(DOWNLOAD_RESULTS_FILE);
}
