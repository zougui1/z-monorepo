import type { Log } from '../Log';
import type { LogLevel } from '../LogLevel';

export interface InternalBaseLoggerConfig {
  minLogLevel: LogLevel;
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
