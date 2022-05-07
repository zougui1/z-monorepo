import mongoose from 'mongoose';
import { getModelForClass } from '@typegoose/typegoose';

import { Prop, EnumProp } from '@zougui/common.mongo-core';
import { LogKind, LogType, LogLevel, EnvironmentTypes } from '@zougui/log.log-types';
import type { WeakEnum, UnknownObject, SimpleVersion } from '@zougui/common.type-utils';

export class EnvironmentContextApp {
  @Prop()
  env!: string;

  @Prop()
  env!: string;

  @Prop()
  env!: string;

  @Prop()
  env!: string;

  @Prop()
  env!: string;

  @Prop()
  env!: string;
}

export class EnvironmentContext {
  @EnumProp({ enum: EnvironmentTypes })
  env!: WeakEnum<EnvironmentTypes>;

  @Prop()
  app!: unknown;

  @Prop()
  loggerVersion!: string;
}

export class Log {
  @EnumProp({ enum: LogKind, array: true })
  logKinds!: WeakEnum<LogKind>[];

  @EnumProp({ enum: LogType })
  type!: WeakEnum<LogType>;

  @EnumProp({ enum: LogLevel })
  level!: WeakEnum<LogLevel>;

  @Prop()
  logId: string;

  @Prop()
  namespace!: string;

  @Prop({ type: [String] })
  tags!: string[];

  @Prop()
  message!: string;

  @Prop({ type: mongoose.Schema.Types.Mixed })
  data!: UnknownObject;

  @Prop({ type: String })
  version!: SimpleVersion;

  @Prop({ type: Date })
  createdAt!: Date;
}
