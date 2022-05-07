import { EnvironmentTypes } from './EnvironmentTypes';

export interface EnvironmentContextApp {
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

export interface EnvironmentBaseContext {
  env: EnvironmentTypes;
  app: EnvironmentContextApp;
  loggerVersion: string;
}

export interface EnvironmentContextOtherEnv extends EnvironmentBaseContext {
  env: EnvironmentTypes.mobile | EnvironmentTypes.electron;
}

//#region node process
export interface EnvironmentNodeContextOs {
  platform: string;
  version: string;
}

export interface EnvironmentNodeProcess {
  os: EnvironmentNodeContextOs;
  versions: NodeJS.ProcessVersions;
  user: string;
  processId: number;
}
//#endregion

//#region browser process
export interface EnvironmentBrowserContextOs {
  platform: string;
}

export interface EnvironmentBrowserProcess {
  os: EnvironmentBrowserContextOs;
  url: string;
  userAgent: string;
  language: string;
  languages: readonly string[];
}
//#endregion

export interface EnvironmentNodeContext extends EnvironmentBaseContext {
  env: EnvironmentTypes.node;
  process: EnvironmentNodeProcess;
}

export interface EnvironmentBrowserContext extends EnvironmentBaseContext {
  env: EnvironmentTypes.browser;
  process: EnvironmentBrowserProcess;
}

export type EnvironmentContext = EnvironmentNodeContext | EnvironmentBrowserContext | EnvironmentContextOtherEnv;
