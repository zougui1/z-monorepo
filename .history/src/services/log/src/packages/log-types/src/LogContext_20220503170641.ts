import type { DateTime } from 'luxon';

import type { UnknownObject } from '@zougui/common.type-utils';
import type { Cause } from '@zougui/common.error-utils';

import { EnvironmentContext } from './EnvironmentContext';
import { LogLevel } from './enums';

export interface LogContext<
  TData extends UnknownObject = UnknownObject,
  TCause extends Cause | undefined = undefined
> {
  level: LogLevel;
  data: TData;
  createdAt: DateTime;
  environment: EnvironmentContext;
  cause: TCause;
}
