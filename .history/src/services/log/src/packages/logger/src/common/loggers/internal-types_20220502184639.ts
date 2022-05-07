import type { LogLevel } from '@zougui/log.log-types';
import type { WeakEnum } from '@zougui/common.type-utils';

import type { Log } from '../Log';

export interface InternalBaseLoggerConfig {
  minLogLevel: WeakEnum<LogLevel>;
  namespace: string;
}

export interface LogOptions {
  level: LogLevel;
}

export interface BatchLog {
  log: Log;
  options: LogOptions;
  callback: (error?: unknown) => void;
}

export interface InternalBaseBatchLoggerConfig {
  interval: number;
}
