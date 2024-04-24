import { Body, Controller, HttpStatus, Post } from '@nestjs/common'
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger'

import { CreateCategoryInput } from '@/core/category/usecases/types'
import { CreatedModel } from '@/infra/repository/types'

import { ICreateCategoryAdapter } from './adapter'
import { SwaggerRequest, SwaggerResponse } from './swagger'

@Controller({ path: 'categories', version: '1' })
@ApiTags('categories')
@ApiBearerAuth()
export class CategoryController {
  constructor(private readonly createCategory: ICreateCategoryAdapter) {}

  @Post()
  @ApiResponse(SwaggerResponse.create[HttpStatus.OK])
  @ApiResponse(SwaggerResponse.create[HttpStatus.BAD_REQUEST])
  @ApiBody(SwaggerRequest.createBody)
  async create(@Body() input: CreateCategoryInput): Promise<CreatedModel> {
    return this.createCategory.execute(input)
  }
}
