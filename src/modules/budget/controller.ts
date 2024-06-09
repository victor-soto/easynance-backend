import { Controller, HttpStatus, Post, Req } from '@nestjs/common'
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger'

import { CreateBudgetInput } from '@/core/budget/usecases/types'
import { CreatedModel } from '@/infra/repository/types'
import { ApiRequest } from '@/utils/request'

import { ICreateBudgetAdapter } from './adapter'
import { SwaggerRequest, SwaggerResponse } from './swagger'

@Controller({ path: 'budgets', version: '1' })
@ApiTags('budgets')
@ApiBearerAuth()
export class BudgetController {
  constructor(private readonly createUseCase: ICreateBudgetAdapter) {}

  @Post()
  @ApiResponse(SwaggerResponse.create[HttpStatus.OK])
  @ApiResponse(SwaggerResponse.create[HttpStatus.BAD_REQUEST])
  @ApiBody(SwaggerRequest.createBody)
  async create(@Req() { body, user }: ApiRequest<CreateBudgetInput>): Promise<CreatedModel> {
    return this.createUseCase.execute(body, user)
  }
}
