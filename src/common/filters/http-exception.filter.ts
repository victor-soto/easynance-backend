import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common'
import { AxiosError } from 'axios'
import { ZodError } from 'zod'

import { ILoggerAdapter } from '@/infra/logger'
import { BaseException, ErrorModel } from '@/utils/exception'

@Catch()
export class ApiExceptionFilter implements ExceptionFilter {
  constructor(private readonly loggerService: ILoggerAdapter) {}

  catch(exception: BaseException, host: ArgumentsHost): void {
    const context = host.switchToHttp()
    const response = context.getResponse()
    const request = context.getRequest<Request>()
    const status = this.getStatus(exception)
    exception.traceId = [exception.traceId, request['id']].find(Boolean)
    const message = this.getMessage(exception)
    this.loggerService.error(exception, message, exception.context)
    response.status(status).json({
      error: {
        code: status,
        traceId: exception.traceId,
        context: exception.context,
        message: message,
        path: request.url
      }
    } as ErrorModel)
  }

  private getStatus(exception: BaseException): number {
    if (exception instanceof ZodError) {
      return HttpStatus.BAD_REQUEST
    }
    return exception instanceof HttpException
      ? exception.getStatus()
      : [exception['status'], HttpStatus.INTERNAL_SERVER_ERROR].find(Boolean)
  }

  private getMessage(exception: BaseException): string {
    if (exception instanceof ZodError) {
      return exception.issues.map((issue) => `${issue.path}: ${issue.message.toLowerCase()}`).join(', ')
    }
    if (exception instanceof AxiosError && (exception as AxiosError).response?.data) {
      return (exception as AxiosError).message
    }
    return exception.message
  }
}
