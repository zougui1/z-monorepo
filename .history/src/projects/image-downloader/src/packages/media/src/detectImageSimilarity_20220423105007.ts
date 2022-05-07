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
  const flatterDocs = allDocs.map(doc => {
    const post = doc.posts[0];

    if (!post?.file) {
      return;
    }

    return {
      _id: doc._id,
      hashes: post.file.hashes,
    };
  }).filter(Boolean);
  console.log('allDocs', JSON.stringify(flatterDocs, null, 2));

  return false;
}
