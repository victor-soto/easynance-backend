import { HttpStatus } from '@nestjs/common'

import { UserRequest } from '@/utils/docs/data/user/request'
import { UserResponse } from '@/utils/docs/data/user/response'
import { Swagger } from '@/utils/docs/swagger'

export const SwaggerResponse = {
  create: {
    [HttpStatus.OK]: Swagger.defaultResponseJSON({
      status: HttpStatus.ACCEPTED,
      json: UserResponse.create,
      description: 'User created'
    })
  }
}

export const SwaggerRequest = {
  createBody: Swagger.defaultRequestJSON(UserRequest.create)
}
