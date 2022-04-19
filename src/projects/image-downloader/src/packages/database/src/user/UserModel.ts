import { prop, getModelForClass } from '@typegoose/typegoose';
import type { DocumentType } from '@zougui/common.mongo-core';

export class UserOrigin {
  @prop({ required: true, trim: true })
  name!: string;

  @prop({ required: true, trim: true })
  url!: string;

  @prop({ required: true, unique: true, trim: true })
  profileUrl!: string;

  @prop({ type: () => String, trim: true })
  avatar?: string | undefined;
}

export class User {
  @prop({ required: true, unique: true })
  id!: string;

  @prop({ required: true, unique: true, trim: true })
  name!: string;

  @prop({ required: true, type: () => [UserOrigin], _id: false })
  origins!: UserOrigin[];
}

export const UserModel = getModelForClass(User);

export type UserDocument = DocumentType<User>;
