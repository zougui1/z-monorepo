import { mediaQueries, UnprocessedMediaDocument, CreateFileData } from '@zougui/image-downloader.database';

import { detectImageSimilarity } from './detectImageSimilarity';

export const createOrAddMedia = async (unprocessedMedia: UnprocessedMediaDocument, fileData: CreateFileData): Promise<void> => {
  console.log('createOrAddMedia', fileData.hashes)
  await detectImageSimilarity(fileData.hashes);
  const existingMedia = await mediaQueries.hashesExist(fileData.hashes);

  if (existingMedia) {
    return await mediaQueries.addPost(existingMedia._id, unprocessedMedia, fileData);
  }

  const media = await mediaQueries.create(unprocessedMedia, fileData);
  await mediaQueries.addPost(media._id, unprocessedMedia, fileData);
}
