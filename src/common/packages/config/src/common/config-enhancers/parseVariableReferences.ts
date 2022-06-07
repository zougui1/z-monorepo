import _ from 'lodash';

import { isObject } from '@zougui/common.object-utils';
import type { UnknownObject } from '@zougui/common.type-utils';

const reVarRefs = /\$\{[a-z0-9._#]+\}/gi;
const allowedVariableTypes = ['string', 'number', 'boolean'];

// TODO improve error handling. need full path for errors

export const parseVariableReferences = (config: UnknownObject) => {
  return parseVariableReferencesOnObject(config, config);
}

const parseVariableReferencesOnObject = (rootConfig: UnknownObject, object: UnknownObject): UnknownObject => {
  const objectWithVars = Object.entries(object).reduce((objectWithVars, [key, value]) => {
    if (typeof value === 'string') {
      const actualKey = key.startsWith('${') && key.endsWith('}')
        ? key.slice(2, -1)
        : key;

      objectWithVars[actualKey] = replaceRefsWithValues(rootConfig, object, key, value);
    } else if (isObject(value)) {
      objectWithVars[key] = parseVariableReferencesOnObject(rootConfig, value as UnknownObject);
    } else {
      objectWithVars[key] = value;
    }

    return objectWithVars;
  }, {} as UnknownObject);

  return objectWithVars;
}

export const replaceRefsWithValues = (rootConfig: UnknownObject, currentObject: UnknownObject, key: string, value: string): unknown => {
  if (key.startsWith('${') && key.endsWith('}')) {
    const valueFromRoot = _.get(rootConfig, value);
    const valueFromCurrentObject = _.get(currentObject, value);

    const actualValue = valueFromCurrentObject === undefined
      ? valueFromRoot
      : valueFromCurrentObject;

    if (value === undefined) {
      throw new Error(`Variable "${value}" not found`);
    }

    return isObject(actualValue)
      ? parseVariableReferencesOnObject(rootConfig, actualValue as UnknownObject)
      : actualValue;
  }

  const varRefs = value.match(reVarRefs);

  if (!varRefs) {
    return value;
  }

  const vars = varRefs.map(varRef => {
    const varPath = varRef.slice(2, -1);
    const valueFromRoot = _.get(rootConfig, varPath);
    const valueFromCurrentObject = _.get(currentObject, varPath);

    const value = valueFromCurrentObject === undefined
      ? valueFromRoot
      : valueFromCurrentObject;

    if (value === undefined) {
      throw new Error(`Variable "${varPath}" not found`);
    }

    const varType = typeof value;

    if (!allowedVariableTypes.includes(varType)) {
      throw new Error(`The type ${varType} can't be used as a variable (${varPath}). Allowed types: ${allowedVariableTypes.join(', ')}`);
    }

    // get the object containing the current variable to then resolve the variables
    // within that variable
    const varObjPath = varPath.split('.').slice(0, -1).join('.');
    const objectContainingVar = _.get(rootConfig, varObjPath) as UnknownObject;
    const valueWithVars = typeof value === 'string'
      ? replaceRefsWithValues(rootConfig, objectContainingVar, key, value)
      : value;

    return {
      ref: varRef,
      value: valueWithVars,
    };
  });

  const valueWithVars = vars.reduce((valueWithVars, { ref, value }) => {
    return valueWithVars.replaceAll(ref, String(value));
  }, value);

  return valueWithVars;
}
