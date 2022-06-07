import { getModelForClass, Ref, ReturnModelType } from '@typegoose/typegoose';
import type { Types } from 'mongoose';

import { Timestamps, WithTimestamps, DocumentType, Prop } from '@zougui/common.mongo-core';

import { Session } from '../session';
import { UserPlatform } from '../userPlatform';

@Timestamps()
export class User {
  @Prop({ unique: true, trim: true })
  name!: string;

  @Prop()
  password!: string;

  @Prop({ unique: true, trim: true })
  email!: string;

  @Prop({ ref: () => Session, type: () => [Session], default: [] })
  sessions!: Ref<Session>[];

  @Prop({ ref: () => UserPlatform, type: () => [UserPlatform], default: [] })
  platforms!: Ref<UserPlatform>[];

  @Prop({ default: false })
  isAdmin: boolean = false;
}

export interface User extends WithTimestamps {}

export const UserModel: ReturnModelType<typeof User> = getModelForClass(User);
export type UserObject = User & { _id: Types.ObjectId };
export type PublicUserObject = Omit<UserObject, 'password'>;
export type UserDocument = DocumentType<User>;
