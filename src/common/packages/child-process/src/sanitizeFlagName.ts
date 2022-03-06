import _ from 'lodash';

export const sanitizeFlagName = (name: string): string => {
  if (name.startsWith('--')) {
    return name;
  }

  return '--' + _.kebabCase(name);
}
