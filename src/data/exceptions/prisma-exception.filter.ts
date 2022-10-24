import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { Response } from 'express';
import { NotFoundError } from '@prisma/client/runtime';

import HttpStatusCode from '../types/HttpStatusCode';

@Catch(NotFoundError)
export class NotFoundExceptionFilter implements ExceptionFilter {
  catch(exception: NotFoundError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    response.status(HttpStatusCode.NOT_FOUND).send(exception.message);
  }
}
