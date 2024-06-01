import { HttpStatus } from '@nestjs/common'

import { BudgetRequest } from '@/utils/docs/data/budget/request'
import { BudgetResponse } from '@/utils/docs/data/budget/response'
import { Swagger } from '@/utils/docs/swagger'

export const SwaggerResponse = {
  create: {
    [HttpStatus.OK]: Swagger.defaultResponseJSON({
      status: HttpStatus.OK,
      json: BudgetResponse.create,
      description: 'Budget created'
    }),
    [HttpStatus.BAD_REQUEST]: Swagger.defaultResponseError({
      status: HttpStatus.BAD_REQUEST,
      route: 'route',
      message: '/api/v1/budgets',
      description: 'Budget bad request.'
    })
  }
}

export const SwaggerRequest = {
  createBody: Swagger.defaultRequestJSON(BudgetRequest.create)
}
