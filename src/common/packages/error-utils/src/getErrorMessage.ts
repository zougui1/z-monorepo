import { isErrorMessageObject } from './isErrorMessageObject';

export function getErrorMessage(error: unknown): string | undefined;
export function getErrorMessage(error: Error | { message: string } | string): string;
export function getErrorMessage(error: unknown, defaultMessage: string): string;
export function getErrorMessage(error: unknown, defaultMessage: string | undefined): string | undefined;
export function getErrorMessage(error: unknown | Error | { message: string } | string, defaultMessage?: string | undefined): string | undefined {
  if (error instanceof Error || isErrorMessageObject(error)) {
    return error.message;
  }

  if (typeof error === 'string') {
    return error;
  }

  return defaultMessage;
}
