import { mediaQueries, UnprocessedMediaDocument, CreateFileData } from '@zougui/image-downloader.database';

import { detectMediaSimilarity } from './detectMediaSimilarity';

// TODO something does not work. the media is neither created nor added
export const createOrAddMedia = async (unprocessedMedia: UnprocessedMediaDocument, fileData: CreateFileData): Promise<void> => {
  const similarMedia = await detectMediaSimilarity(fileData.hashes);
  console.log('similar media detected:', Boolean(similarMedia))

  if (similarMedia) {
    console.log('add post')
    return await mediaQueries.addPost(similarMedia._id, unprocessedMedia, fileData);
  }

  console.log('create post')
  await mediaQueries.create(unprocessedMedia, fileData);
}
