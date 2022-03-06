import { toMs } from '@zougui/common.ms';

import { sanitizeFlag } from './sanitizeFlag';
import { SpawnStdio } from './SpawnStdio';
import type { InternalSpawnOptions, SpawnOptions } from './Spawn';

const defaultSpawnOptions: SpawnOptions = {
  stopOnError: true,
  stdio: 'inherit',
  maxRestarts: 5,
  restartDelay: 0,
  minUptime: 1000,
};

export const processSpawnOptions = (userOptions: SpawnOptions = {}): Readonly<InternalSpawnOptions> => {
  const options = { ...userOptions };

  for (const [key, value] of Object.entries(defaultSpawnOptions)) {
    (options as Record<keyof SpawnOptions, SpawnOptions[keyof SpawnOptions]>)[key as keyof SpawnOptions] ??= value;
  }

  const userArgs = userOptions.args || [];
  const userFlags = userOptions.flags || {};
  const userFlagsAsArgs = Object
    .entries(userFlags)
    .flatMap(([name, value]) => sanitizeFlag(name, value));

  const args = [...userArgs, ...userFlagsAsArgs];

  const internalOptions: InternalSpawnOptions = {
    // for type safety
    maxRestarts: 0,
    ...options,
    args,
    // for type safety
    stdio: options.stdio as SpawnStdio || SpawnStdio.inherit,
    // for type safety
    restartDelay: toMs(options.restartDelay || 0),
    // for type safety
    minUptime: toMs(options.minUptime || 0),
  };

  return internalOptions;
}
