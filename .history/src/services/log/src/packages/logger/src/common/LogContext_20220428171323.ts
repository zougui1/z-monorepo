import { EnvironmentTypes } from './EnvironmentTypes';

export interface LogContextApp {
  /**
   * @example 'development' or 'production'
   */
  env: string;
  name: string;
  version: string;
  file?: string | undefined;
  line?: number | undefined;
  functionName?: string | undefined;
}

export interface LogOtherEnvContext {
  env: EnvironmentTypes.mobile | EnvironmentTypes.electron;
  app: LogContextApp;
  loggerVersion: string;
}

export interface LogBaseContext {
  env: EnvironmentTypes;
  app: LogContextApp;
}

//#region node process
export interface LogNodeContextOs {
  platform: string;
  version: string;
}

export interface LogNodeProcess {
  os: LogNodeContextOs;
  versions: NodeJS.ProcessVersions;
  user: string;
  processId: number;
}
//#endregion

//#region browser process
export interface LogBrowserContextOs {
  platform: string;
}

export interface LogBrowserProcess {
  os: LogBrowserContextOs;
  url: string;
  userAgent: string;
  language: string;
  languages: readonly string[];
}
//#endregion

export interface LogNodeContext extends LogBaseContext {
  env: EnvironmentTypes.node;
  process: LogNodeProcess;
}

export interface LogBrowserContext extends LogBaseContext {
  env: EnvironmentTypes.browser;
  process: LogBrowserProcess;
}

export type LogContext = LogNodeContext | LogBrowserContext | LogOtherEnvContext;
