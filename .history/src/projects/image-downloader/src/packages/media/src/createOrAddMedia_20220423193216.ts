import { mediaQueries, UnprocessedMediaDocument, CreateFileData } from '@zougui/image-downloader.database';

import { detectMediaSimilarity } from './detectMediaSimilarity';

export const createOrAddMedia = async (unprocessedMedia: UnprocessedMediaDocument, fileData: CreateFileData): Promise<void> => {
  const similarMedia = await detectMediaSimilarity(fileData.hashes);

  if (similarMedia) {
    return await mediaQueries.addPost(similarMedia._id, unprocessedMedia, fileData);
  }

  const med = await mediaQueries.create(unprocessedMedia, {...fileData});
  await mediaQueries.addPost(med._id, unprocessedMedia, {...fileData});
}
