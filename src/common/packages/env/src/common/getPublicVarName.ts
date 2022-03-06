import { publicPrefix, reactAppPrefix } from '../prefixes';

export const getPublicVarName = (varName: string): string => {
  const publicVarName = `${publicPrefix}${varName}`;
  const reactAppVarName = `${reactAppPrefix}${varName}`;

  if (varName in process.env) {
    return varName;
  }

  if (publicVarName in process.env) {
    return publicVarName;
  }

  if (reactAppVarName in process.env) {
    return reactAppVarName;
  }

  return varName;
}
