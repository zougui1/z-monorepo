import type { Types } from 'mongoose';

import { MediaModel, MediaDocument } from './MediaModel';
import { convertUnprocessedMedia } from './convertions';
import type { CreateFileData } from './types';
import { UnprocessedMediaDocument } from '../unprocessedMedia';

class MediaQueries {
  create = async (unprocessedMedia: UnprocessedMediaDocument, fileData: CreateFileData): Promise<MediaDocument> => {
    const media = convertUnprocessedMedia(unprocessedMedia, fileData);
    return await MediaModel.create(media);
  }

  addPost = async (id: Types.ObjectId, unprocessedMedia: UnprocessedMediaDocument, fileData: CreateFileData): Promise<void> => {
    const media = convertUnprocessedMedia(unprocessedMedia, fileData);

    await MediaModel.updateOne(
      { _id: id },
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

  findAllHashes = async (): Promise<FindAllHashesResult[]> => {
    const docs = await MediaModel.find({}, { 'posts.0.fileData.hashes': 1 });
    return docs as any;
  }
}

export const mediaQueries = new MediaQueries();

export interface FindAllHashesResult {
  _id: Types.ObjectId;
  fileData: {
    hashes: string[];
  };
}
