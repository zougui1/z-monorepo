import { createException } from './createException';

describe('createException()', () => {
  it('tt', () => {
    const MyError = createException({
      code: '',
      message: '',
    });

    const error = new MyError();

    expect(error).toMatchObject({

    });
  })
});
