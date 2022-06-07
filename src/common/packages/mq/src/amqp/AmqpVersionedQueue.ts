import type { Observable } from 'rxjs';
import type { AnyObjectSchema } from 'yup';

import { AmqpMessageQueue, AmqpMessageQueueOptions } from './AmqpMessageQueue';
import type { AmqpClient } from './AmqpClient';
import type {
  AmqpMessage,
  AmqpVersion,
  MessageTypedSubscribeOptions,
  AmqpMessageHeadersOptions,
} from './types';

export class AmqpVersionedQueue {
  readonly #queueName: string;
  readonly #client: AmqpClient;
  readonly #options: Readonly<AmqpVersionedQueueOptions>;

  constructor(queueName: string, client: AmqpClient, options: AmqpVersionedQueueOptions) {
    this.#queueName = queueName;
    this.#client = client;
    this.#options = options;
  }

  publish = async (
    body: Record<string, any>,
    headers: Omit<AmqpMessageHeadersOptions, 'version'>,
  ): Promise<void> => {
    const { version } = this.#options || {};
    const actualHeaders: AmqpMessageHeadersOptions = {
      ...(headers as AmqpMessageHeadersOptions),
      version,
    };

    return await this.#client.publish(this.#queueName, body, actualHeaders);
  }

  on = async <Body extends Record<string, any> = Record<string, unknown>>(
    type: string | string[],
    listener: ((message: AmqpMessage<Body>) => void),
    options?: MessageTypedSubscribeOptions | undefined,
  ): Promise<void> => {
    const actualOptions = this.getSubscribeOptions(options);

    return await this.#client.on(this.#queueName, type, listener, actualOptions);
  }

  once = async <Body extends Record<string, any> = Record<string, unknown>>(
    type: string | string[],
    listener: ((message: AmqpMessage<Body>) => void),
    options?: MessageTypedSubscribeOptions | undefined,
  ): Promise<void> => {
    const actualOptions = this.getSubscribeOptions(options);

    return await this.#client.once(this.#queueName, type, listener, actualOptions);
  }

  off = async <Body extends Record<string, any> = Record<string, unknown>>(
    type: string | string[],
    listener: ((message: AmqpMessage<Body>) => void),
    options?: MessageTypedSubscribeOptions | undefined,
  ): Promise<void> => {
    const actualOptions = this.getSubscribeOptions(options);
    return await this.#client.off(this.#queueName, type, listener, actualOptions);
  }

  observe = <Body extends Record<string, any> = Record<string, unknown>>(
    type: string | string[],
    options?: MessageTypedSubscribeOptions | undefined,
  ): Observable<AmqpMessage<Body>> => {
    const actualOptions = this.getSubscribeOptions(options);

    return this.#client.observe(this.#queueName, type, actualOptions);
  }

  message = <
    BodySchema extends AnyObjectSchema = AnyObjectSchema,
    HeadersSchema extends AnyObjectSchema = AnyObjectSchema,
  > (options: MessageOptions<BodySchema, HeadersSchema>): AmqpMessageQueue<BodySchema, HeadersSchema> => {
    return new AmqpMessageQueue<BodySchema, HeadersSchema>(this.#queueName, this.#client, {
      ...options,
      version: this.#options.version,
    });
  }

  private getSubscribeOptions(options: MessageTypedSubscribeOptions | undefined = {}): MessageTypedSubscribeOptions {
    const version = this.#options?.version || options.version;

    return {
      ...(options || {}),
      version,
    };
  }
}

export interface AmqpVersionedQueueOptions {
  version: AmqpVersion;
}

export interface MessageOptions<
  BodySchema extends AnyObjectSchema = AnyObjectSchema,
  HeadersSchema extends AnyObjectSchema = AnyObjectSchema,
> {
  type: string;
  headersSchema?: HeadersSchema | undefined;
  bodySchema?: BodySchema | undefined;
}
