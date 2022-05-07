import { createException } from './createException';

const MyError = createException<void, void>({
  code: 'toto',
  message: 'toto',
  version: 'v1',
});

const error = new MyError({ cause: void 0 });

(async () => {
  await new Promise(r => setTimeout(r, 50));
  console.log({ ...error });
})();

export * from './getErrorMessage';
export * from './isErrorMessageObject';
export * from './isMessageObject';
export * from './getErrorObject';
export * from './Exception';
export * from './createException';
export * from './getLimitedStackTrace';
