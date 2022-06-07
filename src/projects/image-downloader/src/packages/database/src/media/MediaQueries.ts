import type { Types } from 'mongoose';

import { MediaModel, MediaDocument, MediaObject } from './MediaModel';
import { convertUnprocessedMedia, convertUnprocessedMediaToPost } from './convertions';
import type { CreateFileData } from './types';
import { UnprocessedMediaDocument } from '../unprocessedMedia';

class MediaQueries {
  findMany = async (): Promise<MediaObject[]> => {
    const medias = await MediaModel
      .aggregate()
      .unwind('posts')
      .replaceRoot('posts')
      .match({ rating: 'SFW' })
      .sort({ publishedAt: -1 })
      .limit(50)
      .lookup({
        from: MediaModel.collection.collectionName,
        localField: '_id',
        foreignField: 'posts._id',
        as: 'group',
      })
      .addFields({
        group: {
          $first: '$group',
        },
      })
      .addFields({
        'file.optimizedMedias': {
          $slice: ['$file.optimizedMedias', 0, 3]
        }
      })
      .project({
        title: 1,
        authors: 1,
        file: {
          fileName: 1,
          size: 1,
          contentType: 1,
          type: 1,
          optimizedMedias: {
            fileName: 1,
            size: 1,
            contentType: 1,
            type: 1,
            label: 1,
          },
        },
        rating: 1,
        group: {
          _id: '$group._id',
          posts: {
            $map: {
              input:'$group.posts',
              as: 'post',
              in: {
                _idl: '$$post._id'
              }
            }
          }
        }
      })
      /*.addFields({
        'group.posts': {
          $map: {
            input: '$group.posts',
            as: 'post',
            in: {
              _id: '$$post._id',
            },
          },
        },
      });*/

    require('fs').writeFileSync('/mnt/Manjaro_Data/zougui/workspace/temp.json', JSON.stringify(medias, null, 2))

    return medias//.map(media => media.toObject());
  }

  create = async (unprocessedMedia: UnprocessedMediaDocument, fileData: CreateFileData): Promise<MediaDocument> => {
    const media = convertUnprocessedMedia(unprocessedMedia, fileData);

    return await MediaModel.create(media);
  }

  addPost = async (id: Types.ObjectId, unprocessedMedia: UnprocessedMediaDocument, fileData: CreateFileData): Promise<void> => {
    const post = convertUnprocessedMediaToPost(unprocessedMedia, fileData);

    await MediaModel.updateOne(
      { _id: id },
      {
        $push: {
          posts: post,
        },
      },
    );
  }

  findByUrl = async (url: string): Promise<MediaDocument | null> => {
    return await MediaModel.findOne({
      'posts.urls': {
        $in: [url],
      } ,
    });
  }

  hashesExist = async (hashes: string[]): Promise<{ _id: Types.ObjectId } | null> => {
    const media = await MediaModel.findOne({ 'posts.file.hashes': hashes }, { _id: 1 });
    return media;
  }

  isAlreadyDownloaded = async ({ url, downloadUrl }: { url: string; downloadUrl: string }): Promise<boolean> => {
    const media = await MediaModel.findOne({
      $or: [
        { 'posts.urls': { $in: [url] } },
        { 'posts.downloadUrls': { $in: [downloadUrl] } },
      ],
    }, { _id: 1 });

    return Boolean(media);
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
