import { Injectable, InternalServerErrorException, Scope } from '@nestjs/common'
import { v4 as uuidv4 } from 'uuid'
import * as winston from 'winston'

import { BaseException } from '@/utils/exception'

import { ILoggerAdapter } from './adapter'
import { ErrorType, MessageType } from './types'

@Injectable({ scope: Scope.REQUEST })
export class LoggerService implements ILoggerAdapter {
  private app: string

  logger: winston.Logger

  async connect(logLevel: string): Promise<void> {
    this.logger = winston.createLogger({
      level: [logLevel, 'silly'].find(Boolean),
      format: winston.format.combine(winston.format.json(), winston.format.colorize()),
      transports: [new winston.transports.Console()]
    })
  }

  setApplication(app: string): void {
    this.app = app
  }

  log(message: string): void {
    this.logger.debug(message)
  }

  debug({ message, context, obj = {} }: MessageType): void {
    Object.assign(obj, { context })
    this.logger.debug([obj, message].find(Boolean))
  }

  info({ message, context, obj }: MessageType): void {
    Object.assign(obj, { context })
    this.logger.info([obj, message].find(Boolean))
  }

  warn({ message, context, obj }: MessageType): void {
    Object.assign(obj, { context })
    this.logger.warn([obj, message].find(Boolean))
  }

  error(error: ErrorType, message?: string, context?: string): void {
    const errorResponse = this.getErrorResponse(error)
    let response =
      error instanceof BaseException
        ? { statusCode: error['statusCode'], message: error?.message, ...error?.parameters }
        : errorResponse?.value()

    const type = {
      Error: BaseException.name
    }[error?.name]
    const messageFind = [message, response?.['message'], error.message].find(Boolean)
    response = typeof response === 'object' ? response : { response }
    this.logger.error(messageFind, {
      ...response,
      context: error?.context ?? context,
      type: [type, error?.name].find(Boolean),
      traceId: this.getTraceId(error),
      application: this.app,
      stack: error.stack,
      ...error?.parameters,
      message: messageFind
    })
  }

  fatal(error: ErrorType, message?: string, context?: string): void {
    this.logger.error(error.message || message, {
      message: error.message || message,
      context: error?.context ?? context,
      type: error.name,
      traceId: this.getTraceId(error),
      application: this.app,
      stack: error.stack
    })
    process.exit(1)
  }

  private getErrorResponse(error: ErrorType): { conditional: boolean; value: () => string | object } {
    const isFunc = typeof error?.getResponse === 'function'
    return [
      {
        conditional: typeof error === 'string',
        value: () => new InternalServerErrorException(error).getResponse()
      },
      {
        conditional: isFunc && typeof error.getResponse() === 'string',
        value: () =>
          new BaseException(
            error.getResponse() as string,
            [error.getStatus(), error['status']].find(Boolean)
          ).getResponse()
      },
      {
        conditional: isFunc && typeof error.getResponse() === 'object',
        value: () => error.getResponse()
      },
      {
        conditional: [error?.name === Error.name, error?.name === TypeError.name].some(Boolean),
        value: () => new InternalServerErrorException(error.message).getResponse()
      }
    ].find((c) => c.conditional)
  }

  private getTraceId(error: ErrorType): string {
    if (typeof error === 'string') return uuidv4()
    return [error.traceId, this.logger.defaultMeta?.['traceId']].find(Boolean)
  }
}
