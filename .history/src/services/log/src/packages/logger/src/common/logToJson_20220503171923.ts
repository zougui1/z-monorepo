import type { LogOptions } from './loggers/internal-types';
import type { Log } from './Log';

export const logToJson = (log: Log, options: LogOptions): any => {
  const { level } = options;

  const json = {
    ...log,
    level,
    createdAt: log.createdAt.toJSDate(),
    message: log.getMessage({
      cause: undefined,
      ...log,
      level,
    }),
  };

  return json;
}
