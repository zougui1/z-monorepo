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
  >(logOptions: CreateTaskLogsOptions): TaskLogsConstructor<TStartData, TSuccessData, TErrorCause> => {
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

  const Success = createLog<TSuccessData, void>(
    {
      ...commonLogOptions,
      code: `${logOptions.baseCode}.success`,
      message: logOptions.messages.success,
    },
    commonOptions,
  );

  const Error = createLog<void, TErrorCause>(
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

  const getSuccessClass = ({ taskId, stopwatch }: { taskId: string; stopwatch: Stopwatch }): typeof Success => {
    return class TaskSuccess extends Success {
      constructor(...args: LogArguments<TSuccessData, void>) {
        super(...args);

        this.taskId = taskId;
        this.timings = getTimings(stopwatch);
      }
    }
  }

  const getErrorClass = ({ taskId, stopwatch }: { taskId: string; stopwatch: Stopwatch }): typeof Error => {
    return class TaskError extends Error {
      constructor(...args: LogArguments<void, TErrorCause>) {
        super(...args);

        this.taskId = taskId;
        this.timings = getTimings(stopwatch);
      }
    }
  }

  class CustomStartLog extends StartLog {
    Success: typeof Success;
    Error: typeof Error;

    constructor(...args: LogArguments<TStartData, void>) {
      super(...args);

      const stopwatch = new Stopwatch();
      const taskId = nanoid();
      const fulfillingClassesOptions = {
        taskId,
        stopwatch,
      };

      this.taskId = taskId;
      this.Success = getSuccessClass(fulfillingClassesOptions);
      this.Error = getErrorClass(fulfillingClassesOptions);

      stopwatch.start();
    }
  }

  return CustomStartLog as any;
}

export interface CreateTaskLogsOptions<T extends UnknownObject | void = void> {
  logKinds?: LogKind[] | undefined;
  namespace: string;
  baseCode: string;
  tags?: string[] | undefined;
  messages: {
    start: ((context: LogContext<RequiredLogData<T>>) => string) | string;
    success: ((context: LogContext<RequiredLogData<T>>) => string) | string;
    error: ((context: LogContext<RequiredLogData<T>>) => string) | string;
  };
  version: SimpleVersion;
}

export interface TaskLogs<
  TStartData extends UnknownObject | void = void,
  TSuccessData extends UnknownObject | void = void,
  TErrorCause extends Cause | void = void,
> extends Log<RequiredLogData<TStartData>, undefined> {
  //Start: Constructor<Log<RequiredLogData<TStartData>>, LogArguments<TStartData, void>>;
  Success: Constructor<Log<RequiredLogData<TSuccessData>>, LogArguments<TSuccessData, void>>;
  Error: Constructor<Log<{}, RequiredLogCause<TErrorCause>>, LogArguments<void, TErrorCause>>;
}

export type TaskLogsConstructor<
TStartData extends UnknownObject | void = void,
TSuccessData extends UnknownObject | void = void,
TErrorCause extends Cause | void = void,
> = Constructor<TaskLogs<RequiredLogData<TStartData>, RequiredLogData<TSuccessData>, RequiredLogCause<TErrorCause>>, LogArguments<TStartData, void>>;
