import 'reflect-metadata';
import * as yup from 'yup';

import { AmqpClient } from './amqp';

(async () => {
  const client = new AmqpClient({ serverUrl: 'localhost' });

  const myQueue = client.queue('my-queue');
  const myQueueV1 = myQueue.version('v1');
  // TODO handle the version on the message level instead of the queue
  const myMessage = myQueueV1.message({
    type: 'my-event',
    headersSchema: yup.object({
      origin: yup.string().required(),
    }),
    bodySchema: yup.object({
      url: yup.string().url().required(),
    }),
  });

  myMessage.on(message => {
    console.log('message:', message.body, 'at', message.headers.publishedAt)
    console.log('headers', message.headers);
    message.ack();
  });
  //myMessage.subscribe(message => { })
  myMessage.publish({ url: 'https://furaffinity.net' }, { origin: 'rggr' })

  /*myQueueV1.observe('my-event').subscribe(message => {
    console.log('message')
    message.ack();
  });*/

  //await myQueue.publish({ data: 'data' }, { messageType: 'my-event', version: 'v2' });
})();
