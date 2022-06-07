import { ValidationError } from 'yup';

import { getConfig } from './getConfig';
import type { ConfigType } from './types';

let config: ReturnType<typeof getConfig>;

try {
  config = getConfig();
} catch (error) {
  if (!(error instanceof ValidationError)) {
    throw error;
  }

  console.log(error.message);

  for (const err of error.inner) {
    console.log(err.message);
  }

  process.exit(1);
}

export * from '../common/non-portable-dependency-types';
export * from './watchForConfigChanges';

export type { ConfigType };
export default config;
