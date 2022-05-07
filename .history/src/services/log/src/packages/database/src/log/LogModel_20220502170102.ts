import mongoose from 'mongoose';
import { getModelForClass } from '@typegoose/typegoose';

import { Prop, EnumProp, DocumentType } from '@zougui/common.mongo-core';
import { LogKind, LogType, LogLevel, EnvironmentTypes } from '@zougui/log.log-types';
import type { WeakEnum, UnknownObject, SimpleVersion } from '@zougui/common.type-utils';

export class EnvironmentContextApp {
  @Prop()
  env!: string;

  @Prop()
  name!: string;

  @Prop()
  version!: string;

  @Prop({ type: String, required: false })
  file?: string | undefined;

  @Prop({ type: Number, required: false })
  line?: number | undefined;

  @Prop({ type: String, required: false })
  functionName?: string | undefined;
}

export class EnvironmentContextOs {
  /**
   * @env {node | browser}
   */
  @Prop()
  platform!: string;

  /**
   * @env {node}
   */
  @Prop({ type: String, required: false })
  version?: string | undefined;
}

export class EnvironmentProcess {
  /**
   * @env {node | browser}
   */
  @Prop({ type: EnvironmentContextOs, _id: false })
  os!: EnvironmentContextOs;

  /**
   * @env {node}
   */
  @Prop({ type: mongoose.Schema.Types.Mixed, required: false, _id: false })
  versions?: NodeJS.ProcessVersions | undefined;

  /**
   * @env {node}
   */
  @Prop({ type: String, required: false })
  user?: string | undefined;

  /**
   * @env {node}
   */
  @Prop({ type: Number, required: false })
  processId?: number | undefined;

  /**
   * @env {node}
   */
  @Prop({ type: Number, required: false })
  parentProcessId?: number | undefined;

  /**
   * @env {browser}
   */
  @Prop({ type: String, required: false })
  url?: string | undefined;

  /**
   * @env {browser}
   */
  @Prop({ type: String, required: false })
  userAgent?: string | undefined;

  /**
   * @env {browser}
   */
  @Prop({ type: String, required: false })
  language?: string | undefined;

  /**
   * @env {browser}
   */
  @Prop({ type: [String], required: false })
  languages?: string[] | undefined;
}

export class EnvironmentContext {
  @EnumProp({ enum: EnvironmentTypes })
  env!: WeakEnum<EnvironmentTypes>;

  @Prop({ type: EnvironmentContextApp, _id: false })
  app!: EnvironmentContextApp;

  @Prop()
  loggerVersion!: string;

  /**
   * @env {node | browser}
   */
  @Prop({ type: EnvironmentProcess, required: false, _id: false })
  process?: EnvironmentProcess | undefined;
}

export class Log {
  @EnumProp({ enum: LogKind, array: true })
  logKinds!: WeakEnum<LogKind>[];

  @EnumProp({ enum: LogType })
  type!: WeakEnum<LogType>;

  @EnumProp({ enum: LogLevel })
  level!: WeakEnum<LogLevel>;

  @Prop()
  logId!: string;

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

  @Prop({ type: EnvironmentContext, _id: false })
  environment!: EnvironmentContext;
}

export const LogModel = getModelForClass(Log);
export type LogDocument = DocumentType<Log>;

export { ReturnModelType } from '@typegoose/typegoose/lib/types';
