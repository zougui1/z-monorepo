import { forEachSpy } from './utils';
import type { SpiesObject } from './types';

export const createSpies = <T extends SpiesObject>(getSpies: (() => T), options: CreateSpiesOptions | undefined = {}): T => {
  const {
    resetBeforeAll = true,
    resetAfterEach = true,
    restoreAfterAll = true,
  } = options;

  // get the spies once since they're expected to be always present
  // even before the hooks get called
  // and restore them as they're not supposed to be effective
  // before the tests actually start
  const spies: T = {} as any;
  //const spies = getSpies();
  //forEachSpy(spies, spy => spy.mockRestore());

  beforeAll(() => {
    const newSpies = getSpies();
    const spiedModules = Object.keys(newSpies) as (keyof T)[];

    for (const spiedModule of spiedModules) {
      spies[spiedModule] = newSpies[spiedModule];
    }

    if (resetBeforeAll) {
      forEachSpy(spies, spy => spy.mockReset());
    }
  });

  if (resetAfterEach) {
    afterEach(() => {
      forEachSpy(spies, spy => spy.mockReset());
    });
  }

  if (restoreAfterAll) {
    afterAll(() => {
      forEachSpy(spies, spy => spy.mockRestore());
    });
  }

  return spies;
}

export interface CreateSpiesOptions {
  /**
   * @default true
   */
  resetBeforeAll?: boolean | undefined;
  /**
   * @default true
   */
  restoreAfterAll?: boolean | undefined;
  /**
   * @default true
   */
  resetAfterEach?: boolean | undefined;
}
