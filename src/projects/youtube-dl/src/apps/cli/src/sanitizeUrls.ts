import { getDownloadResults } from './download-results';
import { cleanYoutubeUrl } from './utils';

export const sanitizeUrls = async (urls: readonly string[]): Promise<string[]> => {
  const downloadResults = await getDownloadResults();

  const sanitizedUrls = urls
    .map(cleanYoutubeUrl)
    .filter(urls => !downloadResults.downloadedUrls.includes(urls));

  return sanitizedUrls;
}
