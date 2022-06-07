import { HttpSource, Fetch, HttpResponse } from '@zougui/common.http-core';
import config from '@zougui/common.config/browser/from-env';

import { PopulatedMedia } from './types';

export class MediaHttp extends HttpSource {
  constructor() {
    super(`${config.media.apiServer.url}/api/v1`);
  }

  getMedias = (): Fetch<HttpResponse<PopulatedMedia[]>> => {
    return this.get('medias');
  }
}

export const mediaHttp = new MediaHttp();
