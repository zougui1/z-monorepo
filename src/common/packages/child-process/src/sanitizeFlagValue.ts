import { quote } from './quote';

export const sanitizeFlagValue = (value: string | number | boolean): string => {
  return quote(String(value));
}
