import { downloadOneMusic } from './downloadOneMusic';
import { logDownloadResult } from './logDownloadResult';
import type { DownloadResults } from '../../types';
import { updateDownloadResults } from '../../download-results';

function* enumerate<T>(array: T[] | readonly T[]): Generator<[number, T]> {
  let index = 0;

  for (const item of array) {
    yield [index++, item];
  }
}

export const downloadManyMusics = async (urls: readonly string[]): Promise<DownloadResults> => {
  const downloadResult: DownloadResults = {
    downloadedUrls: [],
    notDownloadedUrls: [],
  };

  if (!urls.length) {
    console.log('No music to download');
    return downloadResult;
  }

  console.log('Music to download:', urls.length);
  // empty line
  console.log();

  for (const [index, url] of enumerate(urls)) {
    const { success } = await downloadOneMusic(url);

    if (success) {
      downloadResult.downloadedUrls.push(url);
    } else {
      downloadResult.notDownloadedUrls.push(url);
    }

    // empty line
    console.log();
    console.log('Remaining music to download:', urls.length - (index + 1));
    // empty line
    console.log();

    await updateDownloadResults(downloadResult);
  }

  logDownloadResult(downloadResult);

  return downloadResult;
}
