import type { Response } from 'express';

export const allowCors = (response: Response): void => {
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader(
    'Access-Control-Allow-Methods',
    'HEAD, GET, POST, PUT, PATCH, DELETE',
  );
  response.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, Content-Type, Accept, Authorization',
  );
  response.setHeader('Access-Control-Allow-Credentials', 'true');
}
