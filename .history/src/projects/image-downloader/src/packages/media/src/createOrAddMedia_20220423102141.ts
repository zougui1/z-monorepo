import { mediaQueries, UnprocessedMediaDocument, CreateFileData } from '@zougui/image-downloader.database';

import { detectImageSimilarity } from './detectImageSimilarity';

export const createOrAddMedia = async (unprocessedMedia: UnprocessedMediaDocument, fileData: CreateFileData): Promise<void> => {
  console.log('createOrAddMedia')
  await detectImageSimilarity(fileData.hashes);
  const existingMedia = await mediaQueries.hashesExist(fileData.hashes);

  if (existingMedia) {
    return await mediaQueries.addPost(existingMedia._id, unprocessedMedia, fileData);
  }

  await mediaQueries.create(unprocessedMedia, fileData);
}
