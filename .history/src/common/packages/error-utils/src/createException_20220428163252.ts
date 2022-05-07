import type { Constructor } from 'type-fest';

import type { UnknownObject, SimpleVersion } from '@zougui/common.type-utils';

import { Exception, Cause } from './Exception';

export const createException = <
  TData extends UnknownObject | void = void,
  TCause extends Cause | void = void,
>(
  errorData: ExceptionStaticData<TData>
): Constructor<
  Exception<RequiredErrorData<TData>, RequiredErrorCause<TCause>>,
  ExceptionArguments<TData, TCause>
> => {
  return class CustomException extends Exception<RequiredErrorData<TData>, RequiredErrorCause<TCause>> {

    constructor(options?: InferExceptionOptions<ExceptionArguments<TData, TCause>> | undefined) {
      super({
        ...errorData,
        data: (options?.data || {}) as RequiredErrorData<TData>,
        cause: options?.cause as RequiredErrorCause<TCause>,
      });
    }

    // a type error occurs
    // "Type '{ data?: UnknownObject | undefined; cause: Error; }' is not assignable to type 'InferExceptionOptions<ExceptionArguments<TData, TCause>>'"
    // other than that the types work very well
  } as any;
}

export interface ExceptionStaticData<TData extends UnknownObject | void = void> {
  name?: string | undefined;
  code: string;
  message: string | ((data: TData) => string);
  version: SimpleVersion;
}

export type ExceptionArguments<
  TData extends UnknownObject | void = void,
  TCause extends Cause | void = Cause | void,
> = (
  TData extends UnknownObject
    ? TCause extends Cause
      ? [{ data: TData; cause: TCause }]
      : [{ data: TData; cause?: undefined }]
    : TCause extends Cause
      ? [{ data?: undefined; cause: TCause }]
      : ([])
)

export type InferExceptionOptions<T> = T extends [infer TOptions] ? TOptions : never;

export type RequiredErrorData<TData> = TData extends UnknownObject ? TData : never;
export type RequiredErrorCause<TCause> = TCause extends Cause ? TCause : undefined;

const MyFirstError = createException<{ str: string }, Error | undefined>({
  code: 'my.first.error',
  message: 'My first error occured D:',
});

const MyError = createException<void, InstanceType<typeof MyFirstError>>({
  code: 'my.error',
  message: 'My error occured D:',
});

/*const MyError = createException({
  code: 'my.error',
  message: 'My error occured D:',
});*/

/*throw new MyError({
  data: { str: 101 },
  cause: new MyFirstError({
    data: {str: ''}
  })
})*/

//throw new MyError()
