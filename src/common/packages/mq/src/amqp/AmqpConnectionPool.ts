import amqp from 'amqplib';
import type { Connection, Channel, Replies } from 'amqplib';

import type { AmqpConnectorOptions } from './types';


export class AmqpConnectionPool {
  #url: string;
  #openConnections: Set<Connection> = new Set();

  constructor(options: AmqpConnectorOptions) {
    this.#url = `amqp://${options.serverUrl}`;

    process.once('SIGINT', () => this.close());
    process.once('SIGTERM', () => this.close());
    process.once('exit', () => this.close());
  }

  async createChannel(): Promise<{ connection: Connection, channel: Channel }> {
    const connection = await this.connect();
    const channel = await connection.createChannel();

    return { connection, channel };
  }

  async createQueue(queueName: string): Promise<{ connection: Connection, channel: Channel, queue: Replies.AssertQueue }> {
    const { connection, channel } = await this.createChannel();
    const queue = await channel.assertQueue(queueName,  { durable: true });

    return { connection, channel, queue };
  }

  //#region connection handlers
  async connect(): Promise<Connection> {
    const connection = await amqp.connect(this.#url);
    this.#openConnections.add(connection);

    return connection;
  }

  async close(): Promise<void> {
    const connections = Array.from(this.#openConnections)
    await Promise.all(connections.map(async connection => {
      await this.closeConnection(connection);
    }));
  }

  async closeConnection(connection: Connection): Promise<void> {
    await connection.close();
    this.#openConnections.delete(connection);
  }
  //#endregion
}
