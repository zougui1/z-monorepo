import chalk from 'chalk';

import { DownloadResults } from '../../types';

export const logDownloadResult = (result: DownloadResults): void => {
  console.log(chalk.green(`Successfully downloaded ${result.downloadedUrls.length} musics.`));

  for (const url of result.notDownloadedUrls) {
    console.log(chalk.red(`Failed to download: ${url}`));
  }
}
