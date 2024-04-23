import { HttpStatus } from '@nestjs/common'

import { LoginInput } from '@/core/user/usecases/types'
import { Swagger } from '@/utils/docs/swagger'

export const SwaggerResponse = {
  login: {
    [HttpStatus.OK]: Swagger.defaultResponseJSON({
      status: HttpStatus.OK,
      json: { token: '<token>' },
      description: 'User logged.'
    }),
    [HttpStatus.NOT_FOUND]: Swagger.defaultResponseError({
      status: HttpStatus.NOT_FOUND,
      route: '/login',
      message: 'userNotFound',
      description: 'Username or password not found.'
    })
  }
}
export const SwaggerRequest = {
  body: Swagger.defaultRequestJSON({
    login: 'admin',
    password: 'password'
  } as LoginInput)
}
