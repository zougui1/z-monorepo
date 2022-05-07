import StackTracey from 'stacktracey';
import type { Constructor } from 'type-fest';

import { toFunction } from '@zougui/common.function-utils';
import { getLimitedStackTrace, Cause } from '@zougui/common.error-utils';
import type { UnknownObject, SimpleVersion } from '@zougui/common.type-utils';

import { getEnvironmentContext } from './getEnvironmentContext';
import { Log, LogKind, LogContext } from '../common';

export const createLog = <
  TData extends UnknownObject | void = void,
  TCause extends Cause | void = void,
>(logOptions: CreateLogOptions<TData>): Constructor<Log<RequiredLogData<TData>, RequiredLogCause<TCause>>> => {
  const stackFrame = new StackTracey(getLimitedStackTrace({ limit: 2 })).at(1);

  return class NewLog extends Log<RequiredLogData<TData>, RequiredLogCause<TCause>> {
    constructor(options?: LogArguments<TData, TCause> | undefined) {
      const typeSafeOptions = options as Partial<LogOptions<TData, TCause>>;

      super(
        {
          ...logOptions,
          data: (typeSafeOptions?.data || {}) as RequiredLogData<TData>,
          cause: typeSafeOptions?.cause as RequiredLogCause<TCause>,
          message: toFunction(logOptions.message),
        },
        getEnvironmentContext({ stackFrame }),
      );
    }
  }
}

export type LogArguments<
  TData extends UnknownObject | void = void,
  TCause extends Cause | void = Cause | void,
> = (
  TData extends UnknownObject
    ? TCause extends Cause
      ? [LogOptions<TData, TCause>]
      : [Omit<LogOptions<TData, TCause>, 'cause'> & { cause?: undefined }]
    : TCause extends Cause
      ? [Omit<LogOptions<TData, TCause>, 'data'> & { data?: undefined }]
      : []
)

export interface CreateLogOptions<T extends UnknownObject | void = void> {
  logKinds?: LogKind[] | undefined;
  namespace: string;
  code: string;
  tags: string[];
  message: ((context: LogContext<RequiredLogData<T>>) => string) | string;
  version: SimpleVersion;
}

export interface LogOptions<
  T extends UnknownObject | void = void,
  TCause extends Cause | void = void,
> {
  data: T;
  cause: TCause;
}

export type RequiredLogData<TData> = TData extends UnknownObject ? TData : never;

export type RequiredLogCause<TCause> = TCause extends Cause ? TCause : undefined;
