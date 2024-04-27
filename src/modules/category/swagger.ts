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
  },
  update: {
    [HttpStatus.OK]: Swagger.defaultResponseJSON({
      status: HttpStatus.OK,
      json: CategoryResponse.update,
      description: 'Category updated'
    }),
    [HttpStatus.NOT_FOUND]: Swagger.defaultResponseError({
      status: HttpStatus.NOT_FOUND,
      route: 'route',
      message: '/api/v1/categories',
      description: 'Category not found'
    }),
    [HttpStatus.CONFLICT]: Swagger.defaultResponseError({
      status: HttpStatus.CONFLICT,
      route: 'route',
      message: '/api/v1/categories',
      description: "Category's name exists"
    })
  },
  delete: {
    [HttpStatus.OK]: Swagger.defaultResponseJSON({
      status: HttpStatus.OK,
      json: CategoryResponse.delete,
      description: 'Category deleted'
    }),
    [HttpStatus.NOT_FOUND]: Swagger.defaultResponseError({
      status: HttpStatus.NOT_FOUND,
      route: 'route',
      message: '/api/v1/categories/1',
      description: 'Category not found'
    })
  },
  list: {
    [HttpStatus.OK]: Swagger.defaultResponseJSON({
      status: HttpStatus.OK,
      json: CategoryResponse.list,
      description: 'Category list'
    })
  }
}

export const SwaggerRequest = {
  createBody: Swagger.defaultRequestJSON(CategoryRequest.create),
  updateBody: Swagger.defaultRequestJSON(CategoryRequest.update),
  listQuery: {
    pagination: {
      limit: Swagger.defaultApiQueryOptions({ example: 10, name: 'limit', required: false }),
      page: Swagger.defaultApiQueryOptions({ example: 1, name: 'page', required: false })
    },
    sort: Swagger.defaultApiQueryOptions({
      name: 'sort',
      required: false,
      description: `<b>createdAt:desc,login:asc`
    }),
    search: Swagger.defaultApiQueryOptions({
      name: 'search',
      required: false,
      description: `<b>login:value<login>`
    })
  }
}
