import * as commonEnv from '../common';
import { getEnvVar } from '../common/getEnvVar';

export default {
  ...commonEnv,
  get: getEnvVar,
};

setTimeout(() => {
  console.log('timeout');
  (window as any).action();
}, 1000)
