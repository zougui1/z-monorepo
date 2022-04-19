import debug from 'debug';

import { AmqpMessageHeaders } from './types';

export const logPublish = (options: LogOptions): void => {
  logWholeMessage('publish', options);
}

export const logSubscribe = (options: LogOptions): void => {
  logWholeMessage('subscribe', options);
}

export const logAck = (options: LogOptions): void => {
  logMessageId('ack', options);
}

export const logNack = (options: LogOptions): void => {
  logMessageId('nack', options);
}

const logMessageId = (type: LogType, options: LogOptions): void => {
  const namespace = getLogNamespace(type, options);
  debug(namespace)(options.headers.id || '<anonymous message>');
}

const logWholeMessage = (type: LogType, options: LogOptions) => {
  const namespace = getLogNamespace(type, options);
  const data = {
    body: options.body,
    headers: options.headers,
  };

  debug(namespace)(JSON.stringify(data, null, 2));
}

const getLogNamespace = (type: LogType, options: LogNamespaceOptions): string => {
  const { queueName, headers } = options;
  const baseNamespace = `mq:amqp:${queueName}`;

  return headers.messageType
    ? `${baseNamespace}:${headers.messageType}:${type}`
    : `${baseNamespace}:${type}`;
}

export interface LogOptions {
  queueName: string;
  body: Record<string, any>;
  headers: Partial<AmqpMessageHeaders>;
}

interface LogNamespaceOptions {
  queueName: string;
  headers: Partial<AmqpMessageHeaders>;
}

type LogType = 'publish' | 'subscribe' | 'ack' | 'nack';
