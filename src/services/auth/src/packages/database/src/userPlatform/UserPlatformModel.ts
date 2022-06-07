import { getModelForClass, ReturnModelType } from '@typegoose/typegoose';
import type { Types } from 'mongoose';

import { Timestamps, WithTimestamps, DocumentType, Prop } from '@zougui/common.mongo-core';

export class Browser {
  @Prop({ type: String, required: false })
  name?: string | undefined;

  @Prop({ type: String, required: false })
  version?: string | undefined;
}

export class Device {
  @Prop({ type: String, required: false })
  type?: string | undefined;

  @Prop({ type: String, required: false })
  model?: string | undefined;

  @Prop({ type: String, required: false })
  vendor?: string | undefined;
}

export class Engine {
  @Prop({ type: String, required: false })
  name?: string | undefined;

  @Prop({ type: String, required: false })
  version?: string | undefined;
}

export class OS {
  @Prop({ type: String, required: false })
  name?: string | undefined;

  @Prop({ type: String, required: false })
  version?: string | undefined;
}

export class CPU {
  @Prop({ type: String, required: false })
  architecture?: string | undefined;
}

@Timestamps()
export class UserPlatform {
  @Prop()
  userAgent!: string;

  @Prop({ type: () => Browser, _id: false })
  browser!: Browser;

  @Prop({ type: () => Device, _id: false })
  device!: Device;

  @Prop({ type: () => Engine, _id: false })
  engine!: Engine;

  @Prop({ type: () => OS, _id: false })
  os!: OS;

  @Prop({ type: () => CPU, _id: false })
  cpu!: CPU;

  @Prop()
  trusted!: boolean;
}

export interface UserPlatform extends WithTimestamps { }

export const UserPlatformModel: ReturnModelType<typeof UserPlatform> = getModelForClass(UserPlatform);
export type UserPlatformObject = UserPlatform & { _id: Types.ObjectId };
export type UserPlatformDocument = DocumentType<UserPlatform>;
