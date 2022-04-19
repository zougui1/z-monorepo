import type { SpiesObject } from '../types';

export const forEachSpy = (spies: SpiesObject, callback: ((spy: jest.SpyInstance) => void)): void => {
  Object
    .values(spies)
    .map(moduleSpies => Object.values(moduleSpies))
    .flat()
    .forEach(spy => callback(spy));
}
