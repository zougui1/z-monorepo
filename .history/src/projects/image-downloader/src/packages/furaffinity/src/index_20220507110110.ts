import { browse } from './native/browse';
console.log('tt');

(async () => {
  await browse({page: 64});
})().catch(err => console.error(err));

export {
  submission as findSubmission,
  ISubmission,
} from 'furaffinity-api';

export * from './submission';
export * from './enums';
export * from './description/description.types';
