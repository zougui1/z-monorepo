import env from 'env-var';

import { getIsBrowser, getIsJsDom, getIsNode } from './process-environment';

export const NODE_ENV = env.get('NODE_ENV').default('development').asString();
export const isDev = NODE_ENV === 'development';

export const isJsDom = getIsJsDom();
export const isNode = getIsNode();
export const isBrowser = getIsBrowser();
