import { toFunction } from '@zougui/common.function-utils';
import type { UnknownObject } from '@zougui/common.type-utils';

export class Exception<
  TData extends UnknownObject = UnknownObject,
  TCause extends Cause | undefined = Cause | undefined,
> extends Error {
  cause?: TCause;
  code: string;
  data: TData;

  constructor(error: ExceptionData<TData, TCause>) {
    super(toFunction(error.message)(error.data));

    this.name = error.name || this.constructor.name;
    this.code = error.code;
    this.data = error.data;
    this.cause = error.cause;

    Error.captureStackTrace(this, this.constructor);
  }
}

export interface ExceptionData<
  TData extends UnknownObject = UnknownObject,
  TCause extends Cause | undefined = Cause | undefined,
> {
  name?: string | undefined;
  code: string;
  data: TData;
  message: string | ((data: TData) => string);
  cause: TCause;
}

export type Cause<
  TData extends UnknownObject = UnknownObject,
  TCause extends Exception | Error | undefined = Exception<UnknownObject, any> | Error | undefined,
> = Exception<TData, TCause> | Error;
