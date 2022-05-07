import type { Constructor } from 'type-fest';

import type { UnknownObject, SimpleVersion } from '@zougui/common.type-utils';

import { Exception, Cause, ErrorContext } from './Exception';

export const createException = <
  TData extends UnknownObject | void = void,
  TCause extends Cause | unknown | void = void,
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

export interface ExceptionStaticData<
  TData extends UnknownObject | void = void,
  TCause extends Cause | unknown | void = void,
> {
  name?: string | undefined;
  code: string;
  message: string | ((context: ErrorContext<RequiredErrorData<TData>, TCause>) => string);
  version: SimpleVersion;
}

export type ExceptionArguments<
  TData extends UnknownObject | void = void,
  TCause extends Cause | unknown | void = Cause | void,
> = (
  TData extends UnknownObject
    ? TCause extends void
      ? [{ data: TData; cause?: undefined }]
      : [{ data: TData; cause: TCause }]
    : TCause extends void
      ? []
      : [{ data?: undefined; cause: TCause }]
)

export type InferExceptionOptions<T> = T extends [infer TOptions] ? TOptions : never;

export type RequiredErrorData<TData> = TData extends UnknownObject ? TData : never;
export type RequiredErrorCause<TCause> = TCause extends Cause ? TCause : undefined;
