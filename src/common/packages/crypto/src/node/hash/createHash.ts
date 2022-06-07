import { hashers } from './hashers';
import type { SaltOptions, HashResult } from './types';
import { findLatestHashVersion, getVersionedHash } from '../../common';

export async function createHash(plain: string, options?: undefined): Promise<HashResult>;
export async function createHash(plain: string, options: SaltOptions): Promise<HashResult & { salt: Buffer }>;
export async function createHash(plain: string, options?: SaltOptions | undefined): Promise<HashResult>;
export async function createHash(plain: string, options?: SaltOptions | undefined): Promise<HashResult> {
  const latestVersion = findLatestHashVersion();
  const latestHasher = hashers[latestVersion];

  if (!latestHasher) {
    throw new Error(`No hash function for version v${latestVersion}`);
  }

  const hashResult = await latestHasher(plain, options);

  return {
    ...hashResult,
    hash: getVersionedHash(latestVersion, hashResult.hash),
  };
}
