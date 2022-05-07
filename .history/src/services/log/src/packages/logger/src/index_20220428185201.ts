import { createLog } from './node';

const MyLog = createLog({
  code: 'my.log',
  namespace: 'zougui:logger',
  data: {},
  message: 'My log!',
  tags: [],
  version: 'v1',
});

const fn = () => {
  console.log(new MyLog());
}

fn();
