import { getModelForClass, Ref, ReturnModelType } from '@typegoose/typegoose';
import type { Types } from 'mongoose';

import { Timestamps, WithTimestamps, DocumentType, Prop } from '@zougui/common.mongo-core';

import { UserPlatform } from '../userPlatform';

@Timestamps()
export class Session {
  @Prop({ unique: true })
  publicId!: string;

  @Prop({ type: String, required: false })
  label?: string | undefined;

  @Prop({ ref: () => UserPlatform })
  platform!: Ref<UserPlatform>;

  @Prop({ type: Date })
  expiresAt!: Date;

  @Prop()
  ip!: string;

  @Prop({ type: Date })
  lastVisitDate!: Date;

  @Prop()
  openedPages!: number;
}

export interface Session extends WithTimestamps { }

export const SessionModel: ReturnModelType<typeof Session> = getModelForClass(Session);
export type SessionObject = Session & { _id: Types.ObjectId };
export type SessionDocument = DocumentType<Session>;
