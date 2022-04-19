import type { Connection, Channel, Replies } from 'amqplib';

import { AmqpConnectionPool } from './AmqpConnectionPool';
import { createMessageHeaders, matchMessageFilters } from './utils';
import { logPublish, logSubscribe, logAck, logNack } from './debug-logger';
import { validateBody, validateHeaders } from './validators';
import type { LogOptions } from './debug-logger';
import type {
  AmqpConnectorOptions,
  AmqpMessage,
  AmqpMessageHeadersOptions,
  AmqpSubscribeOptions,
  AmqpPublishOptions,
} from './types';

export class AmqpConnector {
  #connections: AmqpConnectionPool;

  constructor(options: AmqpConnectorOptions) {
    this.#connections = new AmqpConnectionPool(options);
  }

  async subscribe<Body extends Record<string, any> = Record<string, unknown>>(
    queueName: string,
    callback: ((message: AmqpMessage<Body>) => void),
    options?: AmqpSubscribeOptions | undefined,
  ): Promise<{ connection: Connection, channel: Channel, queue: Replies.AssertQueue }> {
    const { connection, channel, queue } = await this.#connections.createQueue(queueName);

    channel.consume(queueName, async message => {
      if (!message || !matchMessageFilters(message, options)) {
        return;
      }

      const body = JSON.parse(message.content.toString());
      const { headers } = message.properties;

      const validHeaders = await validateHeaders(headers, options?.headersSchema);
      const validBody = await validateBody(body, options?.bodySchema);

      const logOptions: LogOptions = {
        queueName,
        body: validBody,
        headers: validHeaders,
      };

      logSubscribe(logOptions);

      let acked = false;

      const ack = (allUpTo?: boolean | undefined): void => {
        if (acked) return;
        acked = true;
        channel.ack(message, allUpTo);
        logAck(logOptions);
      }

      const nack = (allUpTo?: boolean | undefined): void => {
        channel.nack(message, allUpTo);
        logNack(logOptions);
      }

      callback({
        headers: validHeaders,
        body: validBody,
        raw: message,
        ack,
        nack,
      });
    });

    return { connection, channel, queue };
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
