import StackTracey from 'stacktracey';
import type { Constructor } from 'type-fest';

import { toFunction } from '@zougui/common.function-utils';
import { getLimitedStackTrace, Cause } from '@zougui/common.error-utils';
import type { UnknownObject, SimpleVersion } from '@zougui/common.type-utils';
import type { LogKind, LogContext } from '@zougui/log.log-types';

import { getEnvironmentContext } from './getEnvironmentContext';
import { Log } from '../common';

export const createLog = <
  TData extends UnknownObject | void = void,
  TCause extends Cause | void = void,
>(logOptions: CreateLogOptions<TData>): Constructor<Log<RequiredLogData<TData>, RequiredLogCause<TCause>>> => {
  return class CustomLog extends Log<RequiredLogData<TData>, RequiredLogCause<TCause>> {
    constructor(options?: LogArguments<TData, TCause> | undefined) {
      const typeSafeOptions = options as Partial<CustomLogOptions<TData, TCause>>;
      const stackFrame = new StackTracey(getLimitedStackTrace({ limit: 2 })).at(2);

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
      ? [CustomLogOptions<TData, TCause>]
      : [Omit<CustomLogOptions<TData, TCause>, 'cause'> & { cause?: undefined }]
    : TCause extends Cause
      ? [Omit<CustomLogOptions<TData, TCause>, 'data'> & { data?: undefined }]
      : []
)

export interface CreateLogOptions<T extends UnknownObject | void = void> {
  logKinds?: LogKind[] | undefined;
  namespace: string;
  code: string;
  tags?: string[] | undefined;
  message: ((context: LogContext<RequiredLogData<T>>) => string) | string;
  version: SimpleVersion;
}

export interface CustomLogOptions<
  T extends UnknownObject | void = void,
  TCause extends Cause | void = void,
> {
  data: T;
  cause: TCause;
}

export type RequiredLogData<TData> = TData extends UnknownObject ? TData : {};

export type RequiredLogCause<TCause> = TCause extends Cause ? TCause : undefined;
