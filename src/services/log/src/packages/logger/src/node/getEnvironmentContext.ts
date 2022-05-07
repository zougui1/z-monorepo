import os from 'node:os';

import type StackTracey from 'stacktracey';

import env from '@zougui/common.env/node';
import { EnvironmentNodeContext, EnvironmentTypes } from '@zougui/log.log-types';

import { loggerVersion } from '../common';

export const getEnvironmentContext = (options: GetEnvironmentContextOptions): EnvironmentNodeContext => {
  const { file, line, callee } = options.stackFrame || {};

  return {
    env: EnvironmentTypes.node,
    loggerVersion,
    process: {
      os: {
        platform: process.platform,
        version: os.release(),
      },
      versions: process.versions,
      user: os.userInfo().username,
      processId: process.pid,
      parentProcessId: process.ppid,
    },
    app: {
      env: env.NODE_ENV,
      name: env.APP_NAME,
      version: env.APP_VERSION,
      file,
      line,
      functionName: callee,
    },
  };
}

export interface GetEnvironmentContextOptions {
  stackFrame?: StackTracey.Entry | undefined;
}
