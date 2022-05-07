import type { DateTime } from 'luxon';

import { EnvironmentContext } from './EnvironmentContext';
import { LogLevel } from './LogLevel';

export interface LogContext<T extends Record<string, any>> {
  level: LogLevel;
  data: T;
  createdAt: DateTime;
  environment: EnvironmentContext;
}
