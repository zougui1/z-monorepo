export type SaltOptions = (
  | { salt?: string | Buffer | undefined; saltLength?: undefined; }
  | { saltLength?: number | undefined; salt?: undefined; }
);

export interface HashResult {
  salt: Buffer | undefined;
  hash: string;
}

export interface Hasher {
  (plain: string, options?: undefined): Promise<HashResult>;
  (plain: string, options: SaltOptions): Promise<HashResult & { salt: Buffer }>;
  (plain: string, options?: SaltOptions | undefined): Promise<HashResult>;
}

export interface Verifier {
  (hash: string, plain: string, options?: { salt?: SaltOptions['salt'] } | undefined): Promise<VerifyResult>;
}

export interface VerifyResult {
  isValid: boolean;
  needsRehash?: boolean | undefined;
}
