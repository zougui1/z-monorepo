import { IOptionalVariable } from 'env-var';

import { configEnv } from './configEnv';
import { getEnvVar } from './getEnvVar';

export const get = (varName: string): IOptionalVariable => {
  configEnv();
  return getEnvVar(varName);
}
