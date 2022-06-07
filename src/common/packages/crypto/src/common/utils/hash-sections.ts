import { prefixWith } from '@zougui/common.string-utils';

import { headerSectionDivider } from '../constants';

const sectionOffset = 1;

export const joinHashSections = (sections: string[]): string => {
  const prefixedSections = sections.map(section => prefixWith(section, headerSectionDivider));
  return prefixedSections.join('');
}

export const splitHashSections = (hash: string): string[] => {
  // since the first character is a divider
  // the first entry in the array will be an empty string
  return hash.split(headerSectionDivider).slice(sectionOffset);
}
