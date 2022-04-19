import { MediaModel, MediaDocument } from './MediaModel';
import { convertUnprocessedMedia } from './convertions';
import { UnprocessedMediaDocument } from '../unprocessedMedia';

class MediaQueries {
  create = async (unprocessedMedia: UnprocessedMediaDocument, fileData: CreateFileData): Promise<MediaDocument> => {
    const media = convertUnprocessedMedia(unprocessedMedia, fileData);
    return await MediaModel.create(media);
  }

  addVariant = async (unprocessedMedia: UnprocessedMediaDocument, fileData: CreateFileData): Promise<void> => {
    const media = convertUnprocessedMedia(unprocessedMedia, fileData);

    await MediaModel.updateOne(
      {
        hash: fileData.hash,
      },
      {
        $push: {
          variants: media,
        },
      },
    );
  }
}

export const mediaQueries = new MediaQueries();

export interface CreateFileData {
  hash: string;
  mimeType: string;
  fileName: string;
}
