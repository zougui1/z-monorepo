import leven from 'fast-levenshtein';

import { mediaQueries } from '@zougui/image-downloader.database';

const similarityThreshold = 5;

export const detectImageSimilarity = async (hashes: string[]): Promise<boolean> => {
  // do a quick find to check if identical hashes already exists
  // before retrieving all hashes from the database to compute the distance
  const hashesMatch = await mediaQueries.hashesExist(hashes);

  if (hashesMatch) {
    return true;
  }

  const allDocs = await mediaQueries.findAllHashes();
  const flatDocs = allDocs.map(doc => {
    const post = doc.posts[0];

    if (!post?.file) {
      return;
    }

    return {
      _id: doc._id,
      hashes: post.file.hashes,
    };
  }).filter(Boolean) as { _id: any; hashes: string[] }[];
  console.log('allDocs', JSON.stringify(flatDocs, null, 2));

  const similarMedias = flatDocs.filter(doc => {
    // TODO better algorithm for similarity detection with
    // TODO arrays that contain multiple hash
    const hashDistances = doc.hashes.map(docHash => {
      const inputDistances = hashes.map(inputHash => leven.get(docHash, inputHash));
      const closeDistance = inputDistances.find(distance => distance <= similarityThreshold);
      return closeDistance;
    }).filter(Boolean) as number[];
    const hasSimilarHash = hashDistances.some(distance => distance <= similarityThreshold);

    return hasSimilarHash;
  });

  // TODO do something else when there is more than 1 similar media
  // TODO save the file data into the collection unprocessedMedias
  // TODO and update the status to "multiple-duplicates" (or something like that)
  // TODO add a field to the collection unprocessedMedias: "statusContext"
  // TODO and add the duplicates' id in it

  return Boolean(similarMedias[0]);
}
