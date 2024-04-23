import { ApiQueryOptions, ApiResponseOptions } from '@nestjs/swagger'

import httpStatus from '@/utils/static/http-status.json'

import { ErrorModel } from '../exception'

type SwaggerError = {
  status: number
  route: string
  message?: string
  description?: string
}

type SwaggerJSON = {
  status: number
  json?: any
  description: string
}

export const Swagger = {
  defaultJSON({ status, route, message, description }: SwaggerError): ApiResponseOptions {
    return {
      schema: {
        example: {
          error: {
            code: status,
            traceId: '<traceId>',
            context: 'context',
            message: [httpStatus[String(status)], message].find(Boolean),
            timestamp: '<timestamp>',
            path: route
          }
        } as ErrorModel
      },
      description,
      status
    }
  },
  defaultResponseJSON({ json, description, status }: SwaggerJSON): ApiResponseOptions {
    return {
      content: {
        'application/json': {
          schema: {
            example: json
          }
        }
      },
      description,
      status
    }
  },
  defaultRequestJSON(json: object): ApiResponseOptions {
    return {
      schema: {
        example: json
      }
    }
  },
  defaultResponseError({ status, route, message, description }: SwaggerError): ApiResponseOptions {
    return {
      schema: {
        example: {
          error: {
            code: status,
            traceId: '<traceId>',
            context: 'context',
            message: [httpStatus[String(status)], message].find(Boolean),
            path: route
          }
        } as ErrorModel
      },
      description,
      status
    }
  },
  defaultApiQueryOptions({ example, name, required, description }: ApiQueryOptions): ApiQueryOptions {
    return {
      schema: { example },
      required,
      name,
      description,
      explode: true,
      type: 'string'
    }
  }
}
