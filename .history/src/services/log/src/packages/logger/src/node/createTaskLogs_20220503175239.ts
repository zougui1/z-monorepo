import { nanoid } from 'nanoid';
import { Stopwatch } from '@zougui/common.stopwatch';
import type { Constructor } from 'type-fest';

import { Cause } from '@zougui/common.error-utils';
import type { UnknownObject, SimpleVersion } from '@zougui/common.type-utils';
import type { LogKind, LogContext, LogTimings } from '@zougui/log.log-types';

import { Log } from '../common';
import { createLog, LogArguments, RequiredLogData, RequiredLogCause } from './createLog';

export const createTaskLogs = <
  TStartData extends UnknownObject | void = void,
  TSuccessData extends UnknownObject | void = void,
  TErrorCause extends Cause | void = void,
>(
  logOptions: CreateTaskLogsOptions<TStartData, TSuccessData, TErrorCause>,
): Constructor<TaskLogs<TStartData, TSuccessData, TErrorCause>> => {
  const commonOptions = { stackTraceLimit: 3 };
  const commonLogOptions = {
    taskId: nanoid(),
    logKinds: logOptions.logKinds,
    namespace: logOptions.namespace,
    tags: logOptions.tags,
    version: logOptions.version,
  };

  const StartLog = createLog<TStartData, void>(
    {
      ...commonLogOptions,
      code: `${logOptions.baseCode}.start`,
      message: logOptions.messages.start,
    },
    commonOptions,
  );

  const SuccessLog = createLog<TSuccessData, void>(
    {
      ...commonLogOptions,
      code: `${logOptions.baseCode}.success`,
      message: logOptions.messages.success,
    },
    commonOptions,
  );

  const ErrorLog = createLog<void, TErrorCause>(
    {
      ...commonLogOptions,
      code: `${logOptions.baseCode}.error`,
      message: logOptions.messages.error,
    },
    commonOptions,
  );

  const getTimings = (stopwatch: Stopwatch): LogTimings => {
    const timing = stopwatch.stop().total;
    const timingMilliseconds = stopwatch.timings.total;

    return {
      raw: timingMilliseconds,
      formatted: timing,
    };

  }

  class TaskLog {
    taskId: string = nanoid();
    stopwatch: Stopwatch = new Stopwatch();

    start = (...args: LogArguments<TStartData, void>): Log<RequiredLogData<TStartData>, undefined> => {
      const log = new StartLog(...args);
      log.taskId = this.taskId;
      this.stopwatch.start();

      return log;
    }

    success = (...args: LogArguments<TSuccessData, void>): Log<RequiredLogData<TSuccessData>, undefined> => {
      const log = new SuccessLog(...args);
      log.taskId = this.taskId;
      log.timings = getTimings(this.stopwatch);

      return log;
    }

    error = (...args: LogArguments<void, TErrorCause>): Log<{}, RequiredLogCause<TErrorCause>> => {
      const log = new ErrorLog(...args);
      log.taskId = this.taskId;
      log.timings = getTimings(this.stopwatch);

      return log;
    }
  }

  return TaskLog as any;
}

export interface CreateTaskLogsOptions<
  TStartData extends UnknownObject | void = void,
  TSuccessData extends UnknownObject | void = void,
  TErrorCause extends Cause | void = void,
> {
  logKinds?: LogKind[] | undefined;
  namespace: string;
  baseCode: string;
  tags?: string[] | undefined;
  messages: {
    start: ((context: LogContext<RequiredLogData<TStartData>>) => string) | string;
    success: ((context: LogContext<RequiredLogData<TSuccessData>>) => string) | string;
    error: ((context: LogContext<UnknownObject, RequiredLogCause<TErrorCause>>) => string) | string;
  };
  version: SimpleVersion;
}

export interface TaskLogs<
  TStartData extends UnknownObject | void = void,
  TSuccessData extends UnknownObject | void = void,
  TErrorCause extends Cause | void = void,
> {
  start: (...args: LogArguments<TStartData, void>) => Log<RequiredLogData<TStartData>>;
  success: (...args: LogArguments<TSuccessData, void>) => Log<RequiredLogData<TSuccessData>>;
  error: (...args: LogArguments<void, TErrorCause>) => Log<{}, RequiredLogCause<TErrorCause>>;
}

export type TaskLogsConstructor<
TStartData extends UnknownObject | void = void,
TSuccessData extends UnknownObject | void = void,
TErrorCause extends Cause | void = void,
> = Constructor<TaskLogs<RequiredLogData<TStartData>, RequiredLogData<TSuccessData>, RequiredLogCause<TErrorCause>>, LogArguments<TStartData, void>>;
