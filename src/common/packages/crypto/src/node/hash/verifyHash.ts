import { verifiers } from './verifiers';
import type { VerifyResult, SaltOptions } from './types';
import { parseHash, findLatestHashVersion } from '../../common';

export async function verifyHash(hash: string, plain: string, options?: { salt?: SaltOptions['salt'] } | undefined): Promise<VerifyResult> {
  const { error, version, hash: versionedHash } = parseHash(hash);

  if (error || !version || !versionedHash) {
    return {
      isValid: false,
    };
  }

  const verifier = verifiers[version];

  if (!verifier) {
    throw new Error(`No hash function for version v${version}`);
  }

  const verifyResult = await verifier(versionedHash, plain, options);
  const isLatestVersion = version >= findLatestHashVersion();

  return {
    ...verifyResult,
    needsRehash: verifyResult.needsRehash || !isLatestVersion,
  };
}
