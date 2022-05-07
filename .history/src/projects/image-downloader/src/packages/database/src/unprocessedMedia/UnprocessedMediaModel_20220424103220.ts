import { prop, getModelForClass, Ref, buildSchema } from '@typegoose/typegoose';
import type { Types } from 'mongoose';

import type { DocumentType } from '@zougui/common.mongo-core';

import { User } from '../user';
import { enumProp, timestamps, WithTimestamps } from '../core';
import type { WeakEnum } from '../core-types';

export enum UnprocessedMediaStatus {
  idle = 'idle',
  downloading = 'downloading',
  success = 'success',
  error = 'error',
  multipleDuplicates = 'multiple-duplicates',
}

export enum TextAlign {
  left = 'left',
  right = 'right',
  center = 'center',
}

export class DescriptionNode {
  @prop({ required: true })
  type!: string;

  @enumProp({ enum: TextAlign })
  textAlign?: WeakEnum<TextAlign> | undefined;

  @prop({ default: '' })
  text!: string;

  @prop({ type: () => String })
  href?: string | undefined;

  @prop({ type: () => String })
  src?: string | undefined;

  @prop({ type: () => String })
  alt?: string | undefined;

  @prop({ type: () => String })
  title?: string | undefined;

  @prop({ type: () => String })
  style?: string | undefined;

  children?: DescriptionNode[] | undefined;
}

export class MediaStatusReport {
  // TODO error schema
  @prop({ type: Object })
  error?: {
    name: string;
    message: string;
    stack: string | undefined;
  };

  @prop({ type: [String] })
  duplicateIds?: Types.ObjectId[];
}

@timestamps()
export class UnprocessedMedia {
  @prop({ required: true })
  id!: string;

  @prop({ required: true, trim: true })
  title!: string;

  @enumProp({ required: true, enum: UnprocessedMediaStatus })
  status!: WeakEnum<UnprocessedMediaStatus>;

  @prop({ type: Object })

  //@prop({ type: () => DescriptionNode, default: [] })
  description!: DescriptionNode;

  @prop({ required: true, unique: true, trim: true })
  url!: string;

  @prop({ trim: true, required: true })
  originalFileName!: string;

  @prop({ required: true, unique: true, trim: true })
  downloadUrl!: string;

  @prop({ type: () => [String], required: true })
  tags!: string[];

  @prop({ type: () => [String], default: [] })
  species!: string[];

  @prop({ type: () => [String], default: [] })
  genders!: string[];

  @prop({ type: () => [String], default: [] })
  categories!: string[];

  @prop({ required: true })
  rating!: string;

  @prop({ type: () => User, ref: () => User, required: true })
  author!: Ref<User>;

  @prop({ type: () => Date, default: () => Date.now() })
  publishedAt!: Date;
}

export interface UnprocessedMedia extends WithTimestamps {}

export const UnprocessedMediaModel = getModelForClass(UnprocessedMedia);
export const DescriptionNodeSchema = buildSchema(DescriptionNode);
// this is the only way to add recursive props as sub-documents
DescriptionNodeSchema.add({ children: [DescriptionNodeSchema] });
// has to be added afterwards as it is using a different schema than typegoose can build
UnprocessedMediaModel.schema.add({
  description: {
    type: DescriptionNodeSchema,
    required: true,
  },
});
export type UnprocessedMediaDocument = DocumentType<UnprocessedMedia>;

export { ReturnModelType } from '@typegoose/typegoose/lib/types';
