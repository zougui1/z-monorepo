const functionStackTraceAdditionalLimit = 1;

export const getLimitedStackTrace = (options?: GetLimitedStackTraceOptions | undefined): string | undefined => {
  const { limit = 0 } = options || {};
  const originalStackTraceLimit = Error.stackTraceLimit;

  Error.stackTraceLimit = limit + functionStackTraceAdditionalLimit;
  const stackTrace = new Error().stack;
  Error.stackTraceLimit = originalStackTraceLimit;

  return stackTrace;
}

export interface GetLimitedStackTraceOptions {
  limit?: number | undefined;
}
