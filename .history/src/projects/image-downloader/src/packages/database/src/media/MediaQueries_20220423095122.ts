import { MediaModel, MediaDocument } from './MediaModel';
import { convertUnprocessedMedia } from './convertions';
import type { CreateFileData } from './types';
import { UnprocessedMediaDocument } from '../unprocessedMedia';

class MediaQueries {
  create = async (unprocessedMedia: UnprocessedMediaDocument, fileData: CreateFileData): Promise<MediaDocument> => {
    const media = convertUnprocessedMedia(unprocessedMedia, fileData);
    return await MediaModel.create(media);
  }

  addPost = async (unprocessedMedia: UnprocessedMediaDocument, fileData: CreateFileData): Promise<void> => {
    const media = convertUnprocessedMedia(unprocessedMedia, fileData);

    await MediaModel.updateOne(
      {
        // TODO better searching algorithm
        hashes: { $all: fileData.hashes },
      },
      {
        $push: {
          posts: media,
        },
      },
    );
  }

  findByUrl = async (url: string): Promise<MediaDocument | null> => {
    return await MediaModel.findOne({
      urls: {
        $in: [url],
      } ,
    });
  }

  hashesExist = async (hashes: string[]): Promise<boolean> => {
    const media = await MediaModel.findOne({ 'file.hashes': hashes }, { _id: 0, hashes: 1 });
    return Boolean(media);
  }
}

export const mediaQueries = new MediaQueries();
