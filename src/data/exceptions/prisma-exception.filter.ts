import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { Response } from 'express';
import {
  NotFoundError,
  PrismaClientKnownRequestError,
} from '@prisma/client/runtime';

import HttpStatusCode from '../types/HttpStatusCode';
import titleCaseWord from '../utils/titleCaseWord';

@Catch(NotFoundError)
export class NotFoundExceptionFilter implements ExceptionFilter {
  catch(exception: NotFoundError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    response.status(HttpStatusCode.NOT_FOUND).send(exception.message);
  }
}

@Catch(PrismaClientKnownRequestError)
export class PrismaClientKnownRequestExceptionFilter
  implements ExceptionFilter
{
  catch(exception: PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    let message = '';

    if (exception.code === 'P2002') {
      const target = (exception.meta as { target: string[] }).target[0];
      message = `${titleCaseWord(target)} already exists`;
    }

    response.status(HttpStatusCode.CONFLICT).send(message);
  }
}
