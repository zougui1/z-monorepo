import { Observable } from 'rxjs';
import type { Connection, Channel, Replies } from 'amqplib';

import { toArray } from '@zougui/common.array';

import type { AmqpConnector } from './AmqpConnector';
import type { AmqpMessage, MessageTypedSubscribeOptions } from './types';

export class RxConsumer {
  #connector: AmqpConnector;

  constructor(connector: AmqpConnector) {
    this.#connector = connector;
  }

  observe<Body extends Record<string, any> = Record<string, unknown>>(
    queueName: string,
    type: string | string[],
    options?: MessageTypedSubscribeOptions | undefined,
  ): Observable<AmqpMessage<Body>> {
    return new Observable(subscriber => {
      this
        .subscribeToTypes<Body>(queueName, toArray(type), message => subscriber.next(message), options)
        .then(({ connection, channel }) => {
          // closes the channel and connection when unsubscribed
          subscriber.add(async () => {
            await channel.close();
            await this.#connector.closeConnection(connection);
          });
        });
    });
  }

  private async subscribeToTypes<Body extends Record<string, any> = Record<string, unknown>>(
    queueName: string,
    types: string[],
    subscribe: ((message: AmqpMessage<Body>) => void),
    options?: MessageTypedSubscribeOptions | undefined,
  ): Promise<{ connection: Connection; channel: Channel; queue: Replies.AssertQueue; }> {
    return await this.#connector.subscribe(queueName, subscribe, {
      ...(options || {}),
      types,
    });
  }
}
