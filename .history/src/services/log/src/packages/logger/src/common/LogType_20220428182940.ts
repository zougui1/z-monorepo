import type { DateTime } from 'luxon';

import type { AnyObject, SimpleVersion } from '@zougui/common.type-utils';

import type { LogKind } from './LogKind';
import type { EnvironmentContext } from './EnvironmentContext';
import type { LogContext } from './LogContext';

export interface LogType<T extends AnyObject> {
  logKinds: LogKind[];
  logId: string;
  code: string;
  namespace: string;
  tags: string[];
  getMessage: (context: LogContext<T>) => string;
  data: T;
  environment: EnvironmentContext;
  version: SimpleVersion;
  createdAt: DateTime;
}
