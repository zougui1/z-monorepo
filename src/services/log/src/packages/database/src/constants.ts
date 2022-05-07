import env from '@zougui/common.env/node';

export const dbName = env.get('LOG_DB_NAME').required().asString();
export const host = env.get('LOG_DB_HOST').asString();
export const port = env.get('LOG_DB_PORT').asPortNumber();
export const username = env.get('LOG_DB_USERNAME').asString();
export const password = env.get('LOG_DB_PASSWORD').asString();
