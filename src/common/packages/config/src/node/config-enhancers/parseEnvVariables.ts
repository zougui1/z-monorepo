import _ from 'lodash';

import { isObject } from '@zougui/common.object-utils';
import type { UnknownObject } from '@zougui/common.type-utils';

const reVarRefs = /env\([a-z0-9._#]+\)/gi;
const allowedVariableTypes = ['string', 'number', 'boolean'];

// TODO improve error handling. need full path for errors

export const parseEnvVariables = (config: UnknownObject) => {
  return parseEnvVariablesOnObject(config, config);
}

const parseEnvVariablesOnObject = (rootConfig: UnknownObject, object: UnknownObject): UnknownObject => {
  const objectWithVars = Object.entries(object).reduce((objectWithVars, [key, value]) => {
    if (typeof value === 'string') {
      objectWithVars[key] = replaceRefsWithValues(value);
    } else if (isObject(value)) {
      objectWithVars[key] = parseEnvVariablesOnObject(rootConfig, value as UnknownObject);
    } else {
      objectWithVars[key] = value;
    }

    return objectWithVars;
  }, {} as UnknownObject);

  return objectWithVars;
}

export const replaceRefsWithValues = (value: string): string => {
  const varRefs = value.match(reVarRefs);

  if (!varRefs) {
    return value;
  }

  const vars = varRefs.map(varRef => {
    const envVarName = varRef.slice(4, -1);
    const value = process.env[envVarName];

    if (value === undefined) {
      throw new Error(`Environment variable "${envVarName}" not found`);
    }

    const varType = typeof value;

    if (!allowedVariableTypes.includes(varType)) {
      throw new Error(`The type ${varType} can't be used as an environment variable (${envVarName}). Allowed types: ${allowedVariableTypes.join(', ')}`);
    }

    return {
      ref: varRef,
      value,
    };
  });

  const valueWithVars = vars.reduce((valueWithVars, { ref, value }) => {
    return valueWithVars.replaceAll(ref, String(value));
  }, value);

  return valueWithVars;
}
