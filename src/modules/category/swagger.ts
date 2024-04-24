import { HttpStatus } from '@nestjs/common'

import { CategoryRequest } from '@/utils/docs/data/category/request'
import { CategoryResponse } from '@/utils/docs/data/category/response'
import { Swagger } from '@/utils/docs/swagger'

export const SwaggerResponse = {
  create: {
    [HttpStatus.OK]: Swagger.defaultResponseJSON({
      status: HttpStatus.OK,
      json: CategoryResponse.create,
      description: 'Category created'
    }),
    [HttpStatus.BAD_REQUEST]: Swagger.defaultResponseError({
      status: HttpStatus.BAD_REQUEST,
      route: 'route',
      message: '/api/v1/categories',
      description: 'Category bad request.'
    })
  }
}

export const SwaggerRequest = {
  createBody: Swagger.defaultRequestJSON(CategoryRequest.create)
}
