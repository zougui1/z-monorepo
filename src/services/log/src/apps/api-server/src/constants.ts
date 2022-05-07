import env from '@zougui/common.env';

export const port = env.get('API_SERVER_PORT').required().asPortNumber();
