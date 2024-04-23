import { HttpStatus } from '@nestjs/common'

import { Swagger } from '@/utils/docs/swagger'

export const SwaggerResponse = {
  logout: {
    [HttpStatus.OK]: Swagger.defaultResponseJSON({
      status: HttpStatus.OK,
      json: {},
      description: 'Logout successfully'
    }),
    [HttpStatus.UNAUTHORIZED]: Swagger.defaultResponseError({
      status: HttpStatus.UNAUTHORIZED,
      route: '/logout',
      message: 'unauthorized',
      description: 'User not logged.'
    })
  }
}

export const SwaggerRequest = {
  body: Swagger.defaultRequestJSON({
    token: '<token>'
  })
}
