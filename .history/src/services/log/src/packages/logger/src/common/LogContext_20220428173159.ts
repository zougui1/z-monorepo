import type { DateTime } from 'luxon';

import type { AnyObject } from '@zougui/common.type-utils';

import { EnvironmentContext } from './EnvironmentContext';
import { LogLevel } from './LogLevel';

export interface LogContext<T extends AnyObject> {
  level: LogLevel;
  data: T;
  createdAt: DateTime;
  environment: EnvironmentContext;
}
