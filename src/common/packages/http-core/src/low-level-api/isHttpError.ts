import { HttpError } from '../types';

export const isHttpError = (error: any): error is HttpError => {
  return error?.isAxiosError
}
