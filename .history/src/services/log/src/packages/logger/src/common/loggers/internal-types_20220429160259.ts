import type { LogLevel } from '../LogLevel';

export interface InternalBaseLoggerConfig {
  minLogLevel: LogLevel;
  namespace: string;
}

export interface LogOptions {
  level: LogLevel;
}
