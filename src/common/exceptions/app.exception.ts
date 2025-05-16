import { HttpException, HttpStatus } from '@nestjs/common';

export class AppException extends HttpException {
  constructor(
    message: string,
    context: string,
    stack?: string,
    status: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR,
  ) {
    super(
      {
        message,
        context,
        timestamp: new Date().toISOString(),
        stack: process.env.NODE_ENV === 'development' ? stack : undefined,
      },
      status,
    );
  }
}
