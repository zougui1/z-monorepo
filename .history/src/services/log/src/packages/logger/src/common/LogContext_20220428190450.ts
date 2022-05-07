import type { DateTime } from 'luxon';

import type { UnknownObject } from '@zougui/common.type-utils';

import { EnvironmentContext } from './EnvironmentContext';
import { LogLevel } from './LogLevel';

export interface LogContext<T extends UnknownObject> {
  level: LogLevel;
  data: T;
  createdAt: DateTime;
  environment: EnvironmentContext;
}
