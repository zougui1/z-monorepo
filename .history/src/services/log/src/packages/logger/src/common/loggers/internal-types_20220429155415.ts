import type { LogLevel } from '../LogLevel';

interface InternalBaseLoggerConfig {
  minLogLevel: LogLevel;
}

export interface BaseLoggerConfig extends Partial<InternalBaseLoggerConfig> {

}
