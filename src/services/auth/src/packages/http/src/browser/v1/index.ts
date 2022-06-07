import config from '@zougui/common.config/browser/from-env';

import { AuthHttp } from '../../common/v1';

export { HttpSource, Fetch, HttpResponse } from '../../common/v1';

export const authHttp = new AuthHttp(config.auth.apiServer.url);
