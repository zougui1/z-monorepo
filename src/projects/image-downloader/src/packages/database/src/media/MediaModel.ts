import { prop, getModelForClass, Ref, ReturnModelType, modelOptions } from '@typegoose/typegoose';
import type { BeAnObject, AnyParamConstructor } from '@typegoose/typegoose/lib/types';
import type { Types } from 'mongoose';

import type { DocumentType } from '@zougui/common.mongo-core';
import type { WeakEnum } from '@zougui/common.type-utils';

import { User } from '../user';
import { DescriptionNode, DescriptionNodeSchema } from '../unprocessedMedia';
import { enumProp, WithTimestamps } from '../core';

export enum MediaType {
  image = 'image',
  story = 'story',
  video = 'video',
}

export enum MediaStatus {
  idle = 'idle',
  downloading = 'downloading',
  success = 'success',
  error = 'error',
}

export interface MediaVariant {
  createdAt: Date;
  updatedAt: Date;
}

export enum MediaTransformation {
  resize = 'resize',
  reformat = 'reformat',
  qualityReduction = 'qualityReduction',
}

export class OptimizedMedia {
  @prop({ required: true })
  extension!: string;

  @prop({ required: true })
  fileName!: string;

  @prop({ required: true, min: 0 })
  size!: number;

  @prop({ min: 0 })
  width!: number;

  @prop({ min: 0 })
  height!: number;

  @enumProp({ enum: MediaTransformation, array: true })
  transformations!: WeakEnum<MediaTransformation>[];

  @prop({ required: true })
  label!: string;

  @prop({ required: true })
  contentType!: string;

  @prop({ required: true })
  type!: string;

  // TODO framerate and duration
}

export class MediaFile {
  @prop({ type: () => [OptimizedMedia], default: [], _id: false })
  optimizedMedias!: OptimizedMedia[];

  @prop({ trim: true, required: true })
  originalFileName!: string;

  @prop({ trim: true, required: true })
  fileName!: string;

  //! unique might not work
  @prop({ type: [String], required: true, unique: true })
  hashes!: string[];

  @prop({ required: true })
  contentType!: string;

  @prop({ required: true })
  type!: string;

  @prop({ required: true })
  extension!: string;

  @prop({ required: true, min: 0 })
  size!: number;

  /**
   * images only
   */
  @prop({ min: 0 })
  width!: number;

  /**
   * images only
   */
  @prop({ min: 0 })
  height!: number;

  /**
   * milliseconds
   * animations only
   */
  @prop({ type: Number, min: 0 })
  duration?: number | undefined;

  /**
   * animations only
   */
  @prop({ type: Number, min: 0 })
  frameCount?: number | undefined;
}

@modelOptions({ schemaOptions: { timestamps: true } })
export class MediaPost {
  @prop({ required: true, trim: true })
  title!: string;
  description!: DescriptionNode;

  @prop({ required: true, type: () => MediaFile, _id: false })
  file!: MediaFile;

  @prop({ required: true, unique: true, default: [], type: () => [String] })
  urls!: string[];

  @prop({ required: true, unique: true, type: () => [String] })
  downloadUrls!: string[];

  @prop({ type: () => [String], required: true, default: [] })
  tags!: string[];

  @prop({ type: () => [String], default: [] })
  species!: string[];

  @prop({ type: () => [String], default: [] })
  genders!: string[];

  @prop({ type: () => [String], default: [] })
  categories!: string[];

  @prop({ required: true })
  rating!: string;

  @prop({ type: () => [User], ref: () => User, required: true })
  authors!: Ref<User>[];

  @prop({ type: () => Date, default: () => Date.now() })
  publishedAt!: Date;

  @prop({ type: () => Date })
  deletedAt?: Date | undefined;
}

export interface MediaPost extends WithTimestamps {}

@modelOptions({ schemaOptions: { timestamps: true } })
export class Media {
  @prop({
    type: () => [MediaPost],
    default: [],
  })
  posts!: MediaPost[];
}

const profileModel = <T extends AnyParamConstructor<any>>(model: ReturnModelType<T, BeAnObject>): ReturnModelType<T, BeAnObject> => {
  const findOne = model.findOne.bind(model);

  (model as any).findOne = (...args: Parameters<typeof model.findOne>) => {
    console.time('findOne');
    console.log(...args)
    return findOne(...args).then((result: any) => {
      console.timeEnd('findOne');
      return result;
    });
  }

  return model;
}

export const MediaModel = getModelForClass(Media);
// has to be added afterwards as it is using a different schema than typegoose can build
MediaModel.schema.add({
  'posts.description': {
    type: DescriptionNodeSchema,
    required: true,
  },
} as any);

const postsChildSchema = MediaModel.schema.childSchemas.find(child => child.model.path === 'posts');
postsChildSchema?.schema.add({
  description: {
    type: DescriptionNodeSchema,
    required: true,
  },
});
//console.log('obj', (postsChildSchema as any)?.schema.tree)
//process.exit(0)
export type MediaObject = Media & { _id: Types.ObjectId };
export type MediaDocument = DocumentType<Media>;

export { ReturnModelType } from '@typegoose/typegoose/lib/types';
