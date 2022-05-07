import { browse } from './native/browse';

(async () => {
  await browse();
})();

export {
  submission as findSubmission,
  ISubmission,
} from 'furaffinity-api';

export * from './submission';
export * from './enums';
export * from './description/description.types';