import { NestInterceptor, Injectable, ExecutionContext, CallHandler } from '@nestjs/common';
import { nanoid } from 'nanoid';
import { tap } from 'rxjs/operators';
import type { Observable } from 'rxjs';
import type { Request, Response } from 'express';

import { ms } from '@zougui/common.ms';

// TODO better logging with the logger package
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest() as Request;
    const { method, url } = request;

    const start = Date.now();
    const requestId = nanoid(6);
    const requestLabel = `{${requestId}} [${method}] ${url}`;

    console.log(requestLabel);

    return next
      .handle()
      .pipe(
        tap(() => {
          const end = Date.now();
          const duration = ms(end - start);
          const response = ctx.getResponse() as Response;
          const { statusCode } = response;

          console.log(`${requestLabel}: ${statusCode} (${duration})`);
        }),
      );
  }
}
