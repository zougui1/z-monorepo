import type { ConsumeMessage, MessagePropertyHeaders } from 'amqplib';
import type { AnyObjectSchema } from 'yup';

export interface AmqpConnectorOptions {
  serverUrl: string;
}

export interface AmqpRawMessage {
  headers: MessagePropertyHeaders;
  body: unknown;
  raw: ConsumeMessage,
  ack: (allUpTo?: boolean | undefined) => void;
  nack: (allUpTo?: boolean | undefined) => void;
}

export interface AmqpMessage<Body = unknown, Headers extends AmqpMessageHeaders = AmqpMessageHeaders> extends Omit<AmqpRawMessage, 'body' | 'headers'> {
  headers: Headers;
  body: Body;
}

export interface AmqpMessageHeaders extends MessagePropertyHeaders, Record<string, any> {
  id: string;
  messageType: string;
  publishedAt: string;
  version: string;
}

export interface AmqpMessageHeadersOptions extends Record<string, any> {
  id?: string | undefined;
  publishedAt?: string | undefined;
  messageType: string;
  version: AmqpVersion;
}

export type AmqpVersion = `v${number}`;

export interface AmqpSubscribeOptions {
  version?: string | undefined;
  types?: string[] | undefined;
  bodySchema?: AnyObjectSchema | undefined;
  headersSchema?: AnyObjectSchema | undefined;
}

export type MessageTypedSubscribeOptions = Omit<AmqpSubscribeOptions, 'types'>;

export interface AmqpPublishOptions {
  bodySchema?: AnyObjectSchema | undefined;
  headersSchema?: AnyObjectSchema | undefined;
}
