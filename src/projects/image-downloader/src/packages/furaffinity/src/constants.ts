import env from '@zougui/common.env/node';

export const cookieA = env.get('FA_COOKIE_A').required().asString();
export const cookieB = env.get('FA_COOKIE_B').required().asString();
