import { prop, getModelForClass, Ref, ReturnModelType, modelOptions } from '@typegoose/typegoose';
import type { BeAnObject, AnyParamConstructor } from '@typegoose/typegoose/lib/types';

import type { DocumentType } from '@zougui/common.mongo-core';

import { User } from '../user';
import { DescriptionNode, DescriptionNodeSchema } from '../unprocessedMedia';

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

@modelOptions({ schemaOptions: { timestamps: true } })
export class MediaVariant {
  @prop({ required: true, trim: true })
  title!: string;

  //@prop({ type: () => DescriptionNode, default: [] })
  description!: DescriptionNode;

  @prop({ required: true })
  fileName!: string;

  @prop()
  mimeType!: string;

  @prop({ required: true })
  hash!: string;

  @prop({ required: true, trim: true, default: [], type: () => [String] })
  urls!: string[];

  @prop({ required: true, trim: true, type: () => [String] })
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

export class Media extends MediaVariant {
  @prop({ required: true, unique: true })
  hash!: string;

  @prop({ required: true, unique: true })
  fileName!: string;

  @prop({
    type: () => [MediaVariant],
    default: [],
  })
  variants!: MediaVariant[];
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

export const MediaModel = profileModel(getModelForClass(Media));
// has to be added afterwards as it is using a different schema than typegoose can build
MediaModel.schema.add({
  description: {
    type: DescriptionNodeSchema,
    required: true,
  },
});
export type MediaDocument = DocumentType<Media>;

export { ReturnModelType } from '@typegoose/typegoose/lib/types';
