import { faker } from '@faker-js/faker'
import { HttpStatus } from '@nestjs/common'

import { UserRequest } from '@/utils/docs/data/user/request'
import { UserResponse } from '@/utils/docs/data/user/response'
import { Swagger } from '@/utils/docs/swagger'

export const SwaggerResponse = {
  create: {
    [HttpStatus.OK]: Swagger.defaultResponseJSON({
      status: HttpStatus.OK,
      json: UserResponse.create,
      description: 'User created'
    })
  },
  update: {
    [HttpStatus.OK]: Swagger.defaultResponseJSON({
      status: HttpStatus.OK,
      json: UserResponse.update,
      description: 'User updated'
    }),
    [HttpStatus.NOT_FOUND]: Swagger.defaultResponseError({
      status: HttpStatus.NOT_FOUND,
      route: '/user',
      message: 'userNotFound',
      description: 'User not found.'
    })
  },
  list: {
    [HttpStatus.OK]: Swagger.defaultResponseJSON({
      status: HttpStatus.OK,
      json: UserResponse.list,
      description: 'User list.'
    })
  },
  delete: {
    [HttpStatus.OK]: Swagger.defaultResponseJSON({
      status: HttpStatus.OK,
      json: UserResponse.delete,
      description: 'User deleted.'
    }),
    [HttpStatus.NOT_FOUND]: Swagger.defaultResponseError({
      status: HttpStatus.NOT_FOUND,
      route: '/user',
      message: 'userNotFound',
      description: 'User not found.'
    })
  }
}

export const SwaggerRequest = {
  createBody: Swagger.defaultRequestJSON(UserRequest.create),
  listQuery: {
    pagination: {
      limit: Swagger.defaultApiQueryOptions({ example: 10, name: 'limit', required: false }),
      page: Swagger.defaultApiQueryOptions({ example: 1, name: 'page', required: false })
    },
    sort: Swagger.defaultApiQueryOptions({
      name: 'sort',
      required: false,
      description: `<b>createdAt:desc,name:asc`
    }),
    search: Swagger.defaultApiQueryOptions({
      name: 'search',
      required: false,
      description: `<b>username:${faker.internet.userName()},firstName:${faker.person.firstName()}`
    })
  }
}
