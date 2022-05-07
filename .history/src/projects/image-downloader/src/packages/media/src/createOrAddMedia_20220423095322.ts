import { mediaQueries, UnprocessedMediaDocument, CreateFileData } from '@zougui/image-downloader.database';

export const createOrAddMedia = async (unprocessedMedia: UnprocessedMediaDocument, fileData: CreateFileData): Promise<void> => {
  const doesExist = await mediaQueries.hashesExist(fileData.hashes);

  if (doesExist) {
    return await mediaQueries.addPost(unprocessedMedia, fileData);
  }

  await mediaQueries.create(unprocessedMedia, fileData);
}
