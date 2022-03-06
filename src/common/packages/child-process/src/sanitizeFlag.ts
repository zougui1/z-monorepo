import { sanitizeFlagName } from './sanitizeFlagName';
import { sanitizeFlagValue } from './sanitizeFlagValue';

export const sanitizeFlag = (name: string, value: string | number | boolean): string[] => {
  const sanitizedName = sanitizeFlagName(name);

  if(value === true) {
    return [sanitizedName];
  }

  if(value === false) {
    return [];
  }

  return [sanitizedName, sanitizeFlagValue(value)];
}
