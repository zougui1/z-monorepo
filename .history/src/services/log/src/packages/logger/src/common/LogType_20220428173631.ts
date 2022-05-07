import type { DateTime } from 'luxon';

import type { AnyObject, SimpleVersion } from '@zougui/common.type-utils';

import { LogKind } from './LogKind';
import { EnvironmentContext } from './EnvironmentContext';
import { LogContext } from './LogContext';

export interface LogType<T extends AnyObject> {
  logKinds: LogKind[];
  logId: string;
  code: string;
  namespace: string;
  tags: string[];
  message: (context: LogContext<T>) => string;
  data: T;
  environment: EnvironmentContext;
  version: SimpleVersion;
  createdAt: DateTime;
}
