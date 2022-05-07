import { createException } from './createException';

describe('createException()', () => {
  it('tt', () => {
    const MyError = createException({
      code: '',
      message: '',
    });

    const error = new MyError();

    console.log({...error})

    expect(error).toMatchObject({

    });
  })
});
