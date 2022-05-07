import type { LogLevel } from '../LogLevel';

export interface InternalBaseLoggerConfig {
  minLogLevel: LogLevel;
}

export interface BaseLoggerConfig extends Partial<InternalBaseLoggerConfig> {

}
