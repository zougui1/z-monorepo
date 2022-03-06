import fs from 'fs-extra';
import _ from 'lodash';

import { getDownloadResults } from './getDownloadResults';
import { DOWNLOAD_RESULTS_FILE } from '../constants';
import { DownloadResults } from '../types';

export const updateDownloadResults = async (results: DownloadResults): Promise<void> => {
  const downloadResults = await getDownloadResults();

  downloadResults.downloadedUrls = _.uniq([
    ...downloadResults.downloadedUrls,
    ...results.downloadedUrls,
  ]);

  downloadResults.notDownloadedUrls = _
    .uniq([...downloadResults.notDownloadedUrls, ...results.notDownloadedUrls])
    // if some URLs have been succesfully downloaded
    // then we remove them from the not downloaded URLs
    // can happen if the use re-try to download a URL and succeeds
    .filter(notDownloadedUrl => !downloadResults.downloadedUrls.includes(notDownloadedUrl));



  await fs.writeJson(DOWNLOAD_RESULTS_FILE, downloadResults, { spaces: 2 });
}
