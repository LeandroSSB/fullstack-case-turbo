import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import {} from 'class-validator';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Erro interno do servidor';

    if (exception instanceof HttpException) {
      const ExceptionResponse: any = exception.getResponse();
      status = exception.getStatus();
      message = exception.message;

      if (typeof ExceptionResponse == 'object') {
        message = ExceptionResponse?.message;
      }
    }

    response.status(status).json({
      success: false,
      message,
      path: request.url,
      timestamp: new Date().toISOString(),
    });
  }
}
