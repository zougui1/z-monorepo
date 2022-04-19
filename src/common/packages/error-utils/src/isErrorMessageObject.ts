import { isMessageObject } from './isMessageObject';

export const isErrorMessageObject = (value: unknown): value is { message: string } => {
  return isMessageObject(value) && typeof value.message === 'string';
}
