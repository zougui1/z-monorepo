import type { Observable } from 'rxjs';

import { AmqpVersionedQueue } from './AmqpVersionedQueue';
import './internal-schemas';
import type { AmqpClient } from './AmqpClient';
import type {
  AmqpMessage,
  AmqpVersion,
  MessageTypedSubscribeOptions,
  AmqpMessageHeadersOptions,
} from './types';

export class AmqpQueue {
  readonly #queueName: string;
  readonly #client: AmqpClient;

  constructor(queueName: string, client: AmqpClient) {
    this.#queueName = queueName;
    this.#client = client;
  }

  publish = async (
    body: Record<string, any>,
    headers: AmqpMessageHeadersOptions,
  ): Promise<void> => {
    return await this.#client.publish(this.#queueName, body, headers);
  }

  on = async <Body extends Record<string, any> = Record<string, unknown>>(
    type: string | string[],
    listener: ((message: AmqpMessage<Body>) => void),
    options?: MessageTypedSubscribeOptions | undefined,
  ): Promise<void> => {
    return await this.#client.on(this.#queueName, type, listener, options);
  }

  once = async <Body extends Record<string, any> = Record<string, unknown>>(
    type: string | string[],
    listener: ((message: AmqpMessage<Body>) => void),
    options?: MessageTypedSubscribeOptions | undefined,
  ): Promise<void> => {
    return await this.#client.once(this.#queueName, type, listener, options);
  }

  off = async <Body extends Record<string, any> = Record<string, unknown>>(
    type: string | string[],
    listener: ((message: AmqpMessage<Body>) => void),
  ): Promise<void> => {
    return await this.#client.off(this.#queueName, type, listener);
  }

  observe = <Body extends Record<string, any> = Record<string, unknown>>(
    type: string | string[],
    options?: MessageTypedSubscribeOptions | undefined,
  ): Observable<AmqpMessage<Body>> => {
    return this.#client.observe(this.#queueName, type, options);
  }

  version = (version: AmqpVersion): AmqpVersionedQueue => {
    return new AmqpVersionedQueue(this.#queueName, this.#client, { version });
  }
}
