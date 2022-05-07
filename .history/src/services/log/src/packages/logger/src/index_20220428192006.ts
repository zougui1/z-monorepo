import { createLog } from './node';

const MyLog = createLog({
  code: 'my.log',
  namespace: 'zougui:logger',
  message: 'My log!',
  tags: [],
  version: 'v1',
});

const fn = () => {
  const myLog = new MyLog();
  const log = {
    ...myLog,
    createdAt: myLog.createdAt.toISO(),
  };

  console.log(log);
}

fn();
