import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let stack = '';
    let details: any = null;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse();
      if (typeof res === 'string') {
        message = res;
      } else if (typeof res === 'object') {
        message = (res as any).message || message;
        details = (res as any);
      }
    } else if (exception instanceof Error) {
      message = exception.message;
      stack = exception.stack || '';
      this.logger.error(`Error: ${message}`, stack);
    }

    // Log full error for debugging
    this.logger.error(`HTTP ${status}: ${message}`, exception instanceof Error ? exception.stack : String(exception));

    response.status(status).json({
      statusCode: status,
      message,
      ...(process.env.NODE_ENV === 'development' ? { details, stack } : {}),
    });
  }
}
