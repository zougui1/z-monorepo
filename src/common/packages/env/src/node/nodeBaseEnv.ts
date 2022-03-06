import path from 'node:path';

import env from 'env-var';

export const APP_NAME = env.get('npm_package_name').default('unknown-app-name').asString();
export const APP_VERSION = env.get('npm_package_version').default('0.0.0').asString();
export const WORKSPACE = env.get('ZOUGUI_WORKSPACE').required().asString();
export const APP_WORKSPACE = path.join(WORKSPACE, APP_NAME);
