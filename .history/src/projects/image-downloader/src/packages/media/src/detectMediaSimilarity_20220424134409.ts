import leven from 'fast-levenshtein';
import type { Types } from 'mongoose';

import { mediaQueries } from '@zougui/image-downloader.database';

const similarityThreshold = 12;

export const detectMediaSimilarity = async (hashes: string[]): Promise<SimilarityDetectionResult[]> => {
  // do a quick find to check if identical hashes already exists
  // before retrieving all hashes from the database to compute the distance
  const hashesMatch = await mediaQueries.hashesExist(hashes);

  if (hashesMatch) {
    return [hashesMatch];
  }

  // TODO get hashes only of the same type of format
  // TODO (e.g. if the input is an image, don't take hashes of videos and GIFs (basically anything that has more than one hash))
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

  return similarMedias;
}

export interface SimilarityDetectionResult {
  _id: Types.ObjectId;
}
