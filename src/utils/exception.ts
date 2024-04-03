import { HttpException } from '@nestjs/common'

type ParametersType = { [key: string]: string | number | object }

export class BaseException extends HttpException {
  traceId: string
  readonly parameters: ParametersType
  readonly context: string
}
