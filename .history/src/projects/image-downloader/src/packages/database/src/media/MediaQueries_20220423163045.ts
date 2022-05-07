import type { Types } from 'mongoose';

import { MediaModel, MediaDocument } from './MediaModel';
import { convertUnprocessedMedia } from './convertions';
import type { CreateFileData } from './types';
import { UnprocessedMediaDocument } from '../unprocessedMedia';

class MediaQueries {
  create = async (unprocessedMedia: UnprocessedMediaDocument, fileData: CreateFileData): Promise<MediaDocument> => {
    const media = convertUnprocessedMedia(unprocessedMedia, fileData);
    console.log('media', JSON.stringify(media, null, 2))
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

  hashesExist = async (hashes: string[]): Promise<{ _id: Types.ObjectId } | null> => {
    const media = await MediaModel.findOne({ 'posts.file.hashes': hashes }, { _id: 1 });
    return media;
  }

  findAllHashes = async (): Promise<FindAllHashesResult[]> => {
    const docs = await MediaModel.find({}, { 'posts.file.hashes': 1 });
    return docs;
  }
}

export const mediaQueries = new MediaQueries();

export interface FindAllHashesResult {
  _id: Types.ObjectId;
  posts: {
    file: {
      hashes: string[];
    };
  }[];
}
