import type { DateTime } from 'luxon';

import type { UnknownObject, SimpleVersion } from '@zougui/common.type-utils';

import type { LogKind } from './LogKind';
import type { LogType } from './LogType';
import type { EnvironmentContext } from './EnvironmentContext';
import type { LogContext } from './LogContext';

export interface LogObject<T extends UnknownObject> {
  logKinds: LogKind[];
  type: LogType;
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
