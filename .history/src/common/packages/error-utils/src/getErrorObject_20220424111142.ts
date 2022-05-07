import { getErrorMessage } from './getErrorMessage';

const defaultErrorName = 'UnknownError';
const defaultErrorMessage = 'An error occured';

export const getErrorObject = (value: unknown): ErrorObject => {
  const errorMessage = getErrorMessage(value, defaultErrorMessage);

  if (typeof value !== 'object' || value) {
    return {
      name: defaultErrorName,
      message: errorMessage,
    };
  }

  return {
    // @ts-ignore
    name: value.name || defaultErrorName,
    message: errorMessage,
    // @ts-ignore
    stack: value.stack,
  };
}

export interface ErrorObject {
  name: string;
  message: string;
  stack?: string | undefined;
}
