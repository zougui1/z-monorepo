import env from 'env-var';
import isBrowser from 'is-browser';

export const NODE_ENV = env.get('NODE_ENV').default('development').asString();
export const isDev = NODE_ENV === 'development';
export { isBrowser };
