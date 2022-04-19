import type { Observable } from 'rxjs';

import { AmqpConnector } from './AmqpConnector';
import { AmqpQueue } from './AmqpQueue';
import { EventConsumer } from './EventConsumer';
import { RxConsumer } from './RxConsumer';
import type {
  AmqpConnectorOptions,
  AmqpMessage,
  MessageTypedSubscribeOptions,
  AmqpMessageHeadersOptions,
  AmqpPublishOptions,
} from './types';

export class AmqpClient {
  readonly #connector: AmqpConnector;
  readonly #eventConsumer: EventConsumer;
  readonly #rxConsumer: RxConsumer;

  constructor(options: AmqpConnectorOptions) {
    this.#connector = new AmqpConnector(options);
    this.#eventConsumer = new EventConsumer(this.#connector);
    this.#rxConsumer = new RxConsumer(this.#connector);
  }

  publish = async (
    queueName: string,
    body: Record<string, any>,
    headers: AmqpMessageHeadersOptions,
    options?: AmqpPublishOptions | undefined,
  ): Promise<void> => {
    return await this.#connector.publish(queueName, body, headers, options);
  }

  on = async <Body extends Record<string, any> = Record<string, unknown>>(
    queueName: string,
    type: string | string[],
    listener: ((message: AmqpMessage<Body>) => void),
    options?: MessageTypedSubscribeOptions | undefined,
  ): Promise<void> => {
    return await this.#eventConsumer.on(queueName, type, listener, options);
  }

  once = async <Body extends Record<string, any> = Record<string, unknown>>(
    queueName: string,
    type: string | string[],
    listener: ((message: AmqpMessage<Body>) => void),
    options?: MessageTypedSubscribeOptions | undefined,
  ): Promise<void> => {
    return await this.#eventConsumer.once(queueName, type, listener, options);
  }

  off = async <Body extends Record<string, any> = Record<string, unknown>>(
    queueName: string,
    type: string | string[],
    listener: ((message: AmqpMessage<Body>) => void),
  ): Promise<void> => {
    return await this.#eventConsumer.off(queueName, type, listener);
  }

  observe = <Body extends Record<string, any> = Record<string, unknown>>(
    queueName: string,
    type: string | string[],
    options?: MessageTypedSubscribeOptions | undefined,
  ): Observable<AmqpMessage<Body>> => {
    return this.#rxConsumer.observe(queueName, type, options);
  }

  queue = (name: string): AmqpQueue => {
    return new AmqpQueue(name, this);
  }

  async close(): Promise<void> {
    await this.#connector.close();
  }
}
