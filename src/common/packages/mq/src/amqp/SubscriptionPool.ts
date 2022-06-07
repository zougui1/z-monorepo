import { EventEmitter } from 'node:events';

import type { Connection, Channel, Replies } from 'amqplib';
import type { SetRequired } from 'type-fest';

import { AmqpConnectionPool } from './AmqpConnectionPool';
import { logSubscribe, logAck, logNack } from './debug-logger';
import { validateBody, validateHeaders } from './validators';
import type { LogOptions } from './debug-logger';
import type {
  AmqpMessage,
  AmqpSubscribeOptions,
  MessageListener,
} from './types';

export class SubscriptionPool {
  #connections: AmqpConnectionPool;
  #queues: Record<string, QueueContext> = {};

  constructor(connections: AmqpConnectionPool) {
    this.#connections = connections;
  }

  async subscribe<Body extends Record<string, any> = Record<string, unknown>>(
    queueName: string,
    callback: MessageListener<Body>,
    options?: AmqpSubscribeOptions | undefined,
  ): Promise<{ connection: Connection, channel: Channel, queue: Replies.AssertQueue }> {
    const isNewQueue = !this.#queues[queueName];
    const queueSubscribers = this.#queues[queueName] ||= { versions: {}, event: new EventEmitter() };
    const versionSubscribers = queueSubscribers.versions[options?.version || '*'] ||= {};

    for (const type of options?.types || ['*']) {
      const messageSubscribers = versionSubscribers[type] ||= [];
      messageSubscribers.push(callback);
    }

    if (isNewQueue) {
      const { connection, channel, queue } = await this.#connections.createQueue(queueName);
      queueSubscribers.connection = connection;
      queueSubscribers.channel = channel;
      queueSubscribers.queue = queue;
      queueSubscribers.event.emit('initialized', { connection, queue, channel });

      console.log('init')
      this.consume(channel, queueName, options);
      return { connection, channel, queue };
    }

    // if the queue isn't new then the connection, channel and queue already are defined
    return {
      connection: queueSubscribers.connection as Connection,
      channel: queueSubscribers.channel as Channel,
      queue: queueSubscribers.queue as Replies.AssertQueue,
    };
  }

  async unsubscribe<Body extends Record<string, any> = Record<string, unknown>>(
    queueName: string,
    callback: ((message: AmqpMessage<Body>) => void),
    options?: AmqpSubscribeOptions | undefined,
  ): Promise<void> {
    console.log('unsubscribe', {
      queueName,
      type: options?.types || ['*'],
      version: options?.version || '*',
    });

    const queue = this.#queues[queueName];

    if (!queue) {
      return;
    }

    const queueVersion = options?.version || '*';
    const versionSubscribers = queue.versions[queueVersion] ||= {};

    for (const type of options?.types || ['*']) {
      console.log('before', versionSubscribers[type])
      versionSubscribers[type] = versionSubscribers[type]?.filter(listener => listener !== callback) || [];
      console.log('after', versionSubscribers[type])

      if (versionSubscribers[type]?.length === 0) {
        delete versionSubscribers[type];
      }
    }

    if (!Object.keys(versionSubscribers).length) {
      delete queue.versions[queueVersion];
    }

    if (!Object.keys(queue.versions).length) {
      const { channel, connection, event } = queue;
      delete this.#queues[queueName];

      if (channel && connection) {
        console.log('do close')
        event.removeAllListeners();
        await channel.close();
        await this.#connections.closeConnection(connection);
      } else {
        event.once('initialized', async (queue: SetRequired<QueueContext, 'channel' | 'connection'>) => {
          console.log('try close')
          event.removeAllListeners();
          queue.channel.
          await queue.channel.close();
          await this.#connections.closeConnection(queue.connection);
          console.log('closed')
        });
      }
    }
  }

  private async consume(
    channel: Channel,
    queueName: string,
    options?: AmqpSubscribeOptions | undefined,
  ): Promise<void> {
    channel.consume(queueName, async message => {
      if (!message) {
        return;
      }

      const queueSubscribers = this.#queues[queueName];

      if (!queueSubscribers) {
        return;
      }

      const { headers } = message.properties;
      const validHeaders = await validateHeaders(headers, options?.headersSchema);

      const versionSubscribers = queueSubscribers.versions[validHeaders.version || '*'] || {};
      const messageSubscribers = versionSubscribers[validHeaders.messageType || '*'] || [];

      if(!messageSubscribers.length) {
        return;
      }

      const body = JSON.parse(message.content.toString());
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

      for (const messageSubscriber of messageSubscribers) {
        messageSubscriber({
          headers: validHeaders,
          body: validBody,
          raw: message,
          ack,
          nack,
        });
      }
    });
  }
}

type QueueContext = {
  connection?: Connection;
  channel?: Channel;
  queue?: Replies.AssertQueue;
  event: EventEmitter;
  versions: Record<string, Record<string, MessageListener<any>[]>>;
}
