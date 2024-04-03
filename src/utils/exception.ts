import { HttpException } from '@nestjs/common'

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
  readonly parameters: ParametersType
  readonly context: string
}
