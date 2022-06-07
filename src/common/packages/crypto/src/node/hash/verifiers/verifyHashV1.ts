import argon2 from 'argon2';

import config from '@zougui/common.config/node';

import { getSalt } from '../utils';
import type { SaltOptions, VerifyResult } from '../types';
import { joinHashSections, splitHashSections } from '../../../common';

export async function verifyHashV1(hash: string, plain: string, options?: { salt?: SaltOptions['salt'] } | undefined): Promise<VerifyResult> {
  const { error, secretIndex, hash: argon2Hash } = parseHashV1(hash);
  const { secrets } = config.crypto.hash.node.v1;

  const latestSecret = secrets[0];
  const secret = secretIndex
    ? secrets.slice().at(secretIndex)
    : undefined;

  if (error || !secret || !argon2Hash) {
    return {
      isValid: false,
    };
  }

  const salt = getSalt(options || {});
  const isValid = await argon2.verify(argon2Hash, plain, {
    salt,
    secret: Buffer.from(secret),
  });
  const needsRehash = latestSecret !== secret;

  return {
    isValid,
    needsRehash,
  };
}

const parseHashV1 = (hash: string): ParseHashV1 => {
  const [secretField, ...hashSections] = splitHashSections(hash);
  const secretIndex = Number(secretField.split('=').pop());

  if (Number.isNaN(secretIndex)) {
    return {
      error: new Error('Invalid hash'),
    };
  }

  return {
    secretIndex,
    hash: joinHashSections(hashSections),
  };
}

type ParseHashV1 = (
  | { secretIndex: number; hash: string; error?: undefined }
  | { secretIndex?: undefined; hash?: undefined; error: Error }
);
