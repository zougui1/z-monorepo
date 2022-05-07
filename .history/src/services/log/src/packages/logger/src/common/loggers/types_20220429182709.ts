import type { InternalBaseLoggerConfig } from './internal-types';
import type { LogLevel } from '../LogLevel';

export interface LogOptions {
  level: LogLevel;
}

export interface BaseLoggerConfig extends Partial<InternalBaseLoggerConfig> {

}
