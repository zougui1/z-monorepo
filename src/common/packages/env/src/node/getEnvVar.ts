import envVar, { IOptionalVariable } from 'env-var';

import { getPublicVarName } from '../common/getPublicVarName';

export const getEnvVar = (varName: string): IOptionalVariable => {
  return envVar.get(getPublicVarName(varName));
}
