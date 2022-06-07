import type { Connection, Channel, Replies } from 'amqplib';

import { AmqpConnectionPool } from './AmqpConnectionPool';
import { SubscriptionPool } from './SubscriptionPool';
import { createMessageHeaders } from './utils';
import { logPublish } from './debug-logger';
import { validateBody, validateHeaders } from './validators';
import type {
  AmqpConnectorOptions,
  AmqpMessageHeadersOptions,
  AmqpSubscribeOptions,
  AmqpPublishOptions,
  MessageListener,
} from './types';

export class AmqpConnector {
  #connections: AmqpConnectionPool;
  #subscriptions: SubscriptionPool;

  constructor(options: AmqpConnectorOptions) {
    this.#connections = new AmqpConnectionPool(options);
    this.#subscriptions = new SubscriptionPool(this.#connections);
  }

  async subscribe<Body extends Record<string, any> = Record<string, unknown>>(
    queueName: string,
    callback: MessageListener<Body>,
    options?: AmqpSubscribeOptions | undefined,
  ): Promise<{ connection: Connection, channel: Channel, queue: Replies.AssertQueue }> {
    return await this.#subscriptions.subscribe(queueName, callback, options);
  }

  async unsubscribe<Body extends Record<string, any> = Record<string, unknown>>(
    queueName: string,
    callback: MessageListener<Body>,
    options?: AmqpSubscribeOptions | undefined,
  ): Promise<void> {
    return await this.#subscriptions.unsubscribe(queueName, callback, options);
  }

  async publish(
    queueName: string,
    body: Record<string, any>,
    headers: AmqpMessageHeadersOptions,
    options?: AmqpPublishOptions | undefined,
  ): Promise<void> {
    const { channel, connection } = await this.#connections.createQueue(queueName);
    const actualHeaders = createMessageHeaders(headers);

    const validHeaders = await validateHeaders(actualHeaders, options?.headersSchema);
    const validBody = await validateBody(body, options?.bodySchema);

    const content = Buffer.from(JSON.stringify(validBody));

    logPublish({
      queueName,
      body: validBody,
      headers: validHeaders,
    });

    channel.sendToQueue(queueName, content, {
      headers: validHeaders,
    });
    await channel.close();
    await this.closeConnection(connection);
  }

  //#region connection handlers
  async close(): Promise<void> {
    await this.#connections.close();
  }

  async closeConnection(connection: Connection): Promise<void> {
    await this.#connections.closeConnection(connection);
  }
  //#endregion
}
