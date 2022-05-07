import {
  mediaQueries,
  UnprocessedMediaDocument,
  CreateFileData,
  unprocessedMediaQueries,
} from '@zougui/image-downloader.database';

import { detectMediaSimilarity } from '../submission-file';

export const createOrAddMedia = async (unprocessedMedia: UnprocessedMediaDocument, fileData: CreateFileData): Promise<void> => {
  const similarMedias = await detectMediaSimilarity(fileData.hashes);

  // if more than one media is similar then we can't determine
  // which one really is an alternate, the detection might have failed
  // to identify a similar image
  if (similarMedias.length > 1) {
    const duplicateIds = similarMedias.map(media => media._id);
    return await unprocessedMediaQueries.multipleDuplicatesFound(unprocessedMedia._id, duplicateIds);
  }

  if (similarMedias.length) {
    return await mediaQueries.addPost(similarMedias[0]._id, unprocessedMedia, fileData);
  }

  await mediaQueries.create(unprocessedMedia, fileData);
}
