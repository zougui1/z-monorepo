import { joinHashSections, splitHashSections } from './hash-sections';
import { headerNamespace } from '../constants';

export const parseHash = (hash: string): ParsedHash => {
  const [namespace, versionField, ...hashSections] = splitHashSections(hash);
  const version = Number(versionField.split('=').pop());

  if (namespace !== headerNamespace || Number.isNaN(version)) {
    return {
      error: new Error('Invalid hash'),
    };
  }

  return {
    version,
    hash: joinHashSections(hashSections),
  };
}

export type ParsedHash = (
  | { version: number; hash: string; error?: undefined }
  | { version?: undefined; hash?: undefined; error: Error }
);
