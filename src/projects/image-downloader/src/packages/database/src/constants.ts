import env from '@zougui/common.env/node';

export const dbName = env.get('MEDIA_DB_NAME').required().asString();
export const host = env.get('MEDIA_DB_HOST').asString();
export const port = env.get('MEDIA_DB_PORT').asPortNumber();
export const username = env.get('MEDIA_DB_USERNAME').asString();
export const password = env.get('MEDIA_DB_PASSWORD').asString();
