import { HttpException, HttpStatus } from '@nestjs/common'

type ParametersType = { [key: string]: string | number | object }

export type ErrorModel = {
  error: {
    code: string | number
    traceId: string
    context: string
    message: string
    path: string
  }
}

export class BaseException extends HttpException {
  traceId: string
  readonly context: string
  readonly statusCode: number
  readonly parameters: ParametersType

  constructor(message: string, status: HttpStatus, parameters?: ParametersType) {
    super(message, status)
    this.statusCode = super.getStatus()
    if (parameters) this.parameters = parameters
    Error.captureStackTrace(this)
  }
}

export class ApiInternalServerException extends BaseException {
  constructor(message?: string, parameters?: ParametersType) {
    super(message ?? ApiInternalServerException.name, HttpStatus.INTERNAL_SERVER_ERROR, parameters)
  }
}

export class ApiUnauthorizedException extends BaseException {
  constructor(message?: string, parameters?: ParametersType) {
    super(message ?? ApiUnauthorizedException.name, HttpStatus.UNAUTHORIZED, parameters)
  }
}

export class ApiBadRequestException extends BaseException {
  constructor(message?: string, parameters?: ParametersType) {
    super(message ?? ApiBadRequestException.name, HttpStatus.BAD_REQUEST, parameters)
  }
}

export class ApiConflictException extends BaseException {
  constructor(message?: string, parameters?: ParametersType) {
    super(message ?? ApiConflictException.name, HttpStatus.CONFLICT, parameters)
  }
}

export class ApiNotFoundException extends BaseException {
  constructor(message?: string, parameters?: ParametersType) {
    super(message ?? ApiNotFoundException.name, HttpStatus.NOT_FOUND, parameters)
  }
}
