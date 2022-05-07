import leven from 'fast-levenshtein';

import { mediaQueries } from '@zougui/image-downloader.database';

export const detectImageSimilarity = async (hashes: string[]): Promise<boolean> => {
  // do a quick find to check if identical hashes already exists
  // before retrieving all hashes from the database to compute the distance
  const hashesMatch = await mediaQueries.hashesExist(hashes);

  if (hashesMatch) {
    return true;
  }

  const allDocs = await mediaQueries.findAllHashes();
  console.log('allDocs', JSON.stringify(allDocs, null, 2));

  return false;
}
