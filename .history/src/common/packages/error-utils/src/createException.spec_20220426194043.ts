import { createException } from './createException';

describe('createException()', () => {
  it('tt', () => {
    const MyError = createException<{}>({
      code: '',
      message: '',
    });

    // @ts-expect-error
    new MyError();
  })
});
