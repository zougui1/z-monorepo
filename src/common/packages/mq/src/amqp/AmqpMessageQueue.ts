import type { Observable } from 'rxjs';
import type { ObjectSchema, AnyObjectSchema, InferType } from 'yup';

import type { AmqpClient } from './AmqpClient';
import type {
  AmqpMessage,
  AmqpVersion,
  MessageTypedSubscribeOptions,
  AmqpMessageHeadersOptions,
  AmqpMessageHeaders,
} from './types';

export class AmqpMessageQueue<
  BodySchema extends AnyObjectSchema = AnyObjectSchema,
  HeadersSchema extends AnyObjectSchema = AnyObjectSchema,
> {
  readonly #queueName: string;
  readonly #client: AmqpClient;
  readonly #options: Readonly<AmqpMessageQueueOptions<BodySchema, HeadersSchema>>;

  constructor(queueName: string, client: AmqpClient, options: AmqpMessageQueueOptions<BodySchema, HeadersSchema>) {
    this.#queueName = queueName;
    this.#client = client;
    this.#options = options;
  }

  publish = async (
    body: InferType<BodySchema>,
    headers?: InferType<HeadersSchema> | undefined,
  ): Promise<void> => {
    const { version, type } = this.#options;
    const actualHeaders: AmqpMessageHeadersOptions = {
      ...(headers || {} as AmqpMessageHeadersOptions),
      version,
      messageType: type,
    };

    return await this.#client.publish(this.#queueName, body, actualHeaders, this.#options);
  }

  on = async (
    listener: ((message: AmqpMessage<InferType<BodySchema>, InferType<HeadersSchema> & AmqpMessageHeaders>) => void),
    options?: MessageTypedSubscribeOptions | undefined,
  ): Promise<void> => {
    const { type } = this.#options;
    const actualOptions = this.getSubscribeOptions(options);

    return await this.#client.on(this.#queueName, type, listener, actualOptions);
  }

  once = async (
    listener: ((message: AmqpMessage<InferType<BodySchema>, InferType<HeadersSchema> & AmqpMessageHeaders>) => void),
    options?: MessageTypedSubscribeOptions | undefined,
  ): Promise<void> => {
    const { type } = this.#options;
    const actualOptions = this.getSubscribeOptions(options);

    return await this.#client.once(this.#queueName, type, listener, actualOptions);
  }

  off = async (
    listener: ((message: AmqpMessage<InferType<BodySchema>, InferType<HeadersSchema> & AmqpMessageHeaders>) => void),
    options?: MessageTypedSubscribeOptions | undefined,
  ): Promise<void> => {
    const { type } = this.#options;
    const actualOptions = this.getSubscribeOptions(options);
    return await this.#client.off(this.#queueName, type, listener, actualOptions);
  }

  observe = (
    options?: MessageTypedSubscribeOptions | undefined,
  ): Observable<AmqpMessage<InferType<BodySchema>, InferType<HeadersSchema> & AmqpMessageHeaders>> => {
    const { type } = this.#options;
    const actualOptions = this.getSubscribeOptions(options);

    return this.#client.observe(this.#queueName, type, actualOptions);
  }

  private getSubscribeOptions(options: MessageTypedSubscribeOptions | undefined = {}): MessageTypedSubscribeOptions {
    const version = this.#options.version || options.version;

    return {
      ...(options || {}),
      version,
      headersSchema: this.#options.headersSchema,
      bodySchema: this.#options.bodySchema,
    };
  }
}

export interface AmqpMessageQueueOptions<
  BodySchema extends AnyObjectSchema = AnyObjectSchema,
  HeadersSchema extends AnyObjectSchema = AnyObjectSchema,
> {
  version: AmqpVersion;
  type: string;
  headersSchema?: HeadersSchema | undefined;
  bodySchema?: BodySchema | undefined;
}
