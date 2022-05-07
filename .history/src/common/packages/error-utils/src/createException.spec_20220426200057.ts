import { Exception } from './Exception';
import { createException } from './createException';

describe('createException()', () => {
  const code = 'error.code';
  const message = 'Error message';
  const name = 'ValidationError';

  it('should be an instance of Exception', () => {
    const MyError = createException({ code, message });
    const error = new MyError();

    expect(error).toBeInstanceOf(Exception);
  });

  it('should have the correct properties defined', () => {
    const MyError = createException({ code, message, name });
    const error = new MyError();

    expect(error).toMatchObject({
      code,
      message,
      name,
      //data: ''
    });
  });
});