/*import { TaskLogBuilder } from '@zougui/logger';
import { getErrorMessage } from '@zougui/error';

import { logger } from '../logger';
import { isHttpError } from '../isHttpError';
import { isCancel } from '../isCancel';
import { getPublicConfig, getPublicError, getPublicResponse } from '../utils';
import { HttpRequestConfig, HttpResponse } from '../types';

const logHttpError = (error: any) => {
  const requestId = error?.config?.requestId;

  if (requestId) {
    const requestLogs = new HttpLogTask(getPublicConfig(error.config), requestId);

    if (isCancel(error)) {
      logger.info(requestLogs.error({ canceled: true, reason: error.message }));
    } else if (isHttpError(error)) {
      logger.error(requestLogs.error({ error: getPublicError(error) }));
    }
  }

  return error;
}

export const requestLoggerInterceptor = {
  onResolved: (config: HttpRequestConfig): HttpRequestConfig => {
    if (config.requestId) {
      const requestLogs = new HttpLogTask(getPublicConfig(config), config.requestId);
      logger.info(requestLogs.start());
    }

    return config;
  },
  onRejected: logHttpError,
};

export const responseLoggerInterceptor = {
  onResolved: (response: HttpResponse): HttpResponse => {
    if (response.config.requestId) {
      const requestLogs = new HttpLogTask(getPublicConfig(response.config), response.config.requestId);
      logger.info(requestLogs.success({ response: getPublicResponse(response) }));
    }

    return response;
  },
  onRejected: logHttpError,
};

interface HttpLogTaskData {
  requestId: string;
  method: string;
  url: string;
}

interface HttpLogTaskErrorData {
  reason?: string;
  canceled?: boolean;
}

const HttpLogTask = new TaskLogBuilder<HttpLogTaskData, HttpLogTaskErrorData>()
  .setCode('http')
  .setTopics(['http'])
  .setVersion('v1')
  .setMessages({
    start: ({ data }) => `Executing HTTP request "${data.requestId}" on ${data.method} "${data.url}"...`,
    success: ({ data }) => `Successfully executed HTTP request "${data.requestId}".`,
    error: ({ data }) => data.canceled
      ? `HTTP request cancelled "${data.requestId}": ${data.reason || getErrorMessage(data.error, 'No reason provided.')}`
      : `An error occured with the HTTP request "${data.requestId}": ${getErrorMessage(data.error)}`,
  })
  .toClass();
*/
export { };
