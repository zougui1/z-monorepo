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
>(options: CreateLogOptions<TData>): Constructor<Log<RequiredLogData<TData>>> => {
  const stackFrame = new StackTracey(getLimitedStackTrace({ limit: 2 })).at(1);

  return class NewLog extends Log<RequiredLogData<TData>> {
    constructor() {
      super(
        {
          ...options,
          data: options.data || {},
        message: toFunction(options.message),
        },
        getEnvironmentContext({ stackFrame }),
      );
    }
  }
}

export interface CreateLogOptions<T extends UnknownObject | void = void> {
  logKinds?: LogKind[] | undefined;
  namespace: string;
  code: string;
  tags: string[];
  message: ((context: LogContext<RequiredLogData<T>>) => string) | string;
  data: T;
  version: SimpleVersion;
  cause?: Cause | undefined;
}

export type RequiredLogData<TData> = TData extends UnknownObject ? TData : never;

export type RequiredLogCause<TCause> = TCause extends Cause ? TCause : undefined;