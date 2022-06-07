import type { Connection, Channel, Replies } from 'amqplib';

import { toArray } from '@zougui/common.array';

import type { AmqpConnector } from './AmqpConnector';
import type { AmqpMessage, MessageTypedSubscribeOptions, MessageListener } from './types';

export class EventConsumer {
  #connector: AmqpConnector;
  #listeners: Map<string, Map<MessageListener<any>, { connection: Connection; channel: Channel }>> = new Map();
  /**
   * is needed to map from external listener: given to `this.once`
   * to the internal listener: wrapper around the external listener
   * which automatically remove itself once executed
   */
  #listenersMap: Map<MessageListener<any>, MessageListener<any>> = new Map();

  constructor(connector: AmqpConnector) {
    this.#connector = connector;
  }

  async on<Body extends Record<string, any> = Record<string, unknown>>(
    queueName: string,
    type: string | string[],
    listener: MessageListener<Body>,
    options?: MessageTypedSubscribeOptions | undefined,
  ): Promise<void> {
    const types = toArray(type);
    const { connection, channel } = await this.subscribe<Body>(queueName, types, listener, options);
    const eventNames = getEventNames(queueName, types);

    for (const eventName of eventNames) {
      const mqMap = this.#listeners.get(eventName);

      if (mqMap) {
        mqMap.set(listener, { connection, channel });
      } else {
        const mqMap = new Map([[listener, { connection, channel }]]);
        this.#listeners.set(eventName, mqMap);
      }
    }
  }

  async once<Body extends Record<string, any> = Record<string, unknown>>(
    queueName: string,
    type: string | string[],
    listener: MessageListener<Body>,
    options?: MessageTypedSubscribeOptions | undefined,
  ): Promise<void> {
    const handler = async (message: AmqpMessage<Body>): Promise<void> => {
      try {
        await listener(message);
      } finally {
        await this.off(queueName, type, handler);
      }
    }

    this.#listenersMap.set(listener, handler);
    await this.on(queueName, type, handler, options);
  }

  async off<Body extends Record<string, any> = Record<string, unknown>>(
    queueName: string,
    type: string | string[],
    listener: MessageListener<Body>,
    options?: MessageTypedSubscribeOptions | undefined,
  ): Promise<void> {
    if (typeof type === 'string') {
      const eventName = getEventName(queueName, type);
      const mqMap = this.#listeners.get(eventName);
      await this.#connector.unsubscribe(queueName, listener, {
        ...(options || {}),
        types: [type],
      });

      if (!mqMap) {
        return;
      }

      const actualListener = this.#listenersMap.get(listener) || listener;
      mqMap.delete(actualListener);

      return;
    }

    await Promise.all(type.map(type => this.off(queueName, type, listener)));
  }

  private async subscribe<Body extends Record<string, any> = Record<string, unknown>>(
    queueName: string,
    types: string[],
    listener: MessageListener<Body>,
    options?: MessageTypedSubscribeOptions | undefined,
  ): Promise<{ connection: Connection, channel: Channel, queue: Replies.AssertQueue }> {
    return await this.#connector.subscribe(queueName, listener, {
      ...(options || {}),
      types,
    });
  }
}

const getEventName = (queueName: string, type: string): string => {
  return `${queueName}:${type}`;
}

const getEventNames = (queueName: string, types: string[]): string[] => {
  return types.map(type => getEventName(queueName, type));
}
