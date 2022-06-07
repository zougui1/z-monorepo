import argon2 from 'argon2';

import config from '@zougui/common.config/node';

import { getSalt } from '../utils';
import type { SaltOptions, HashResult } from '../types';
import { joinHashSections } from '../../../common';

const variantMap: Record<string, 0 | 1 | 2> = {
  d: argon2.argon2d,
  i: argon2.argon2i,
  id: argon2.argon2id,
};

export async function createHashV1(plain: string, options?: undefined): Promise<HashResult>;
export async function createHashV1(plain: string, options: SaltOptions): Promise<HashResult & { salt: Buffer }>;
export async function createHashV1(plain: string, options?: SaltOptions | undefined): Promise<HashResult>;
export async function createHashV1(plain: string, options?: SaltOptions | undefined): Promise<HashResult> {
  const {
    secrets,
    iterations,
    memory,
    parallelism,
    saltLength,
    variant,
  } = config.crypto.hash.node.v1;

  const latestSecret = secrets[0];

  if (!latestSecret) {
    throw new Error('Secret missing for hash V1');
  }

  const salt = getSalt(options || {});

  const hash = await argon2.hash(plain, {
    parallelism,
    salt,
    memoryCost: memory,
    timeCost: iterations,
    saltLength: salt ? undefined : saltLength,
    raw: false,
    secret: Buffer.from(latestSecret),
    type: variantMap[variant],
  });

  const actualHash = joinHashSections([`s=-${secrets.length}`, hash]);

  return {
    salt,
    hash: actualHash,
  };
}
