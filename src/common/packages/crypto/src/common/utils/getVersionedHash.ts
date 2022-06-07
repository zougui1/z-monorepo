import { joinHashSections } from './hash-sections';
import { headerNamespace } from '../constants';

export const getVersionedHash = (version: number, hash: string): string => {
  return joinHashSections([headerNamespace, `v=${version}`, hash]);
}
