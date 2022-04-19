import { nanoid } from 'nanoid';
import type { ConsumeMessage } from 'amqplib';

import { AmqpMessageHeaders, AmqpMessageHeadersOptions, AmqpSubscribeOptions } from './types';

export const createMessageHeaders = (headers: AmqpMessageHeadersOptions): AmqpMessageHeaders => {
  const id = headers.id ?? nanoid();
  const publishedAt = headers.publishedAt ?? new Date().toISOString();

  return {
    ...headers,
    id,
    publishedAt,
  };
}

export const matchMessageFilters = (message: ConsumeMessage, options: AmqpSubscribeOptions | undefined): boolean => {
  const { version, messageType } = message.properties.headers;

  const matchMessageVersion = !options?.version || options.version === version;
  const matchMessageType = !options?.types || options.types.includes(messageType);

  return matchMessageVersion && matchMessageType;
}
