import React from 'react';

export const replaceReactElements = (value: unknown): unknown => {
  if (!value || typeof value !== 'object') {
    return value;
  }

  if (React.isValidElement(value)) {
    return '[object ReactElement]';
  }

  if (Array.isArray(value)) {
    return value.map(replaceReactElements);
  }

  return Object.entries(value as any).reduce((object, [key, value]) => {
    object[key] = replaceReactElements(value);
    return object;
  }, {} as Record<string, any>);
}
