import leven from 'fast-levenshtein';
import type { Types } from 'mongoose';

import { mediaQueries } from '@zougui/image-downloader.database';

const similarityThreshold = 5;

export const detectMediaSimilarity = async (hashes: string[]): Promise<SimilarityDetectionResult | undefined> => {
  // do a quick find to check if identical hashes already exists
  // before retrieving all hashes from the database to compute the distance
  const hashesMatch = await mediaQueries.hashesExist(hashes);

  if (hashesMatch) {
    return hashesMatch;
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

  // TODO do something else when there is more than 1 similar media
  // TODO save the file data into the collection unprocessedMedias
  // TODO and update the status to "multiple-duplicates" (or something like that)
  // TODO add a field to the collection unprocessedMedias: "statusContext"
  // TODO and add the duplicates' id in it

  if (similarMedias[0]) {
    return {
      _id: similarMedias[0]._id
    };
  }
}

export interface SimilarityDetectionResult {
  _id: Types.ObjectId;
}
