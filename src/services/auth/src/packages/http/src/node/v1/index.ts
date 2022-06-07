import config from '@zougui/common.config/node';

import { AuthHttp } from '../../common/v1';

export const authHttp = new AuthHttp(config.auth.apiServer.url);
