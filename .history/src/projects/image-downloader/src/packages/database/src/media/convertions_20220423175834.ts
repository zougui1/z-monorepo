import type { Media } from './MediaModel';
import type { CreateFileData } from './types';
import { UnprocessedMediaDocument } from '../unprocessedMedia';

export const convertUnprocessedMedia = (unprocessedMedia: UnprocessedMediaDocument, fileData: CreateFileData): Media => {
  const media = {
    posts: [
      {
        title: unprocessedMedia.title,
        // description cannot be accessed directly through the document.
        // probably due to a bug caused by the description being added
        // to the schema after it is built. but can be accessed via `.toObject()`
        description: unprocessedMedia.toObject().description,
        file: {
          originalFileName: unprocessedMedia.originalFileName,
          fileName: fileData.fileName,
          contentType: fileData.contentType,
          hashes: fileData.hashes,
          width: fileData.width,
          height: fileData.height,
          extension: fileData.extension,
          type: fileData.type,
          size: fileData.size,
          optimizedMedias: fileData.optimizedMedias,
        },
        urls: [unprocessedMedia.url],
        downloadUrls: [unprocessedMedia.downloadUrl],
        tags: unprocessedMedia.tags,
        species: unprocessedMedia.species,
        genders: unprocessedMedia.genders,
        categories: unprocessedMedia.categories,
        rating: unprocessedMedia.rating,
        authors: [unprocessedMedia.author],
        publishedAt: unprocessedMedia.publishedAt,
        createdAt: unprocessedMedia.createdAt,
        updatedAt: new Date(),
      },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  return media;
}
