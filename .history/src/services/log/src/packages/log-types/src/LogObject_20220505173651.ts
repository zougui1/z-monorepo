import type { DateTime } from 'luxon';

import type { UnknownObject, SimpleVersion } from '@zougui/common.type-utils';
import type { Cause } from '@zougui/common.error-utils';

import { LogType, LogKind } from './enums';
import type { EnvironmentContext } from './EnvironmentContext';
import type { LogContext } from './LogContext';
import type { LogTimings } from './LogTimings';

export interface LogObject<
  TData extends UnknownObject = UnknownObject,
  TCause extends Cause | undefined = undefined,
> {
  logKinds: LogKind[];
  type: LogType;
  taskId?: string | undefined;
  logId: string;
  code: string;
  namespace: string;
  tags: string[];
  getMessage: (context: LogContext<TData, TCause>) => string;
  data: TData;
  environment: EnvironmentContext;
  version: SimpleVersion;
  createdAt: DateTime;
  cause?: TCause;
  timings?: LogTimings | undefined;
}
