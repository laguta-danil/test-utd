import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { AppException } from '../exceptions/app.exception';

interface ErrorResponse {
  message: string;
  context: string;
  timestamp: string;
  stack?: string;
}

interface HttpExceptionResponse {
  message?: string;
  error?: string;
  statusCode?: number;
}

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let errorResponse: ErrorResponse = {
      message: 'Internal server error',
      context: 'System',
      timestamp: new Date().toISOString(),
    };

    if (exception instanceof AppException) {
      const error = exception.getResponse() as ErrorResponse;
      status = exception.getStatus();
      errorResponse = error;
      this.logger.error(`[${error.context}] ${error.message}`, error.stack);
    } else if (exception instanceof HttpException) {
      status = exception.getStatus();
      const error = exception.getResponse() as HttpExceptionResponse;
      errorResponse = {
        message: error.message || error.error || 'HTTP Exception',
        context: 'HTTP',
        timestamp: new Date().toISOString(),
      };
      this.logger.error(`[HTTP] ${errorResponse.message}`);
    } else if (exception instanceof Error) {
      errorResponse = {
        message: exception.message,
        context: 'System',
        timestamp: new Date().toISOString(),
        stack:
          process.env.NODE_ENV === 'development' ? exception.stack : undefined,
      };
      this.logger.error(exception.message, exception.stack);
    } else {
      this.logger.error('Unexpected error', exception);
    }

    response.status(status).json(errorResponse);
  }
}
