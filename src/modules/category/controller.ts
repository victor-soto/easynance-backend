import { Body, Controller, HttpStatus, Post, Put } from '@nestjs/common'
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger'

import { CreateCategoryInput, UpdateCategoryInput, UpdateCategoryOutput } from '@/core/category/usecases/types'
import { CreatedModel } from '@/infra/repository/types'

import { ICreateCategoryAdapter, IUpdateCategoryAdapter } from './adapter'
import { SwaggerRequest, SwaggerResponse } from './swagger'

@Controller({ path: 'categories', version: '1' })
@ApiTags('categories')
@ApiBearerAuth()
export class CategoryController {
  constructor(
    private readonly createCategory: ICreateCategoryAdapter,
    private readonly updateCategory: IUpdateCategoryAdapter
  ) {}

  @Post()
  @ApiResponse(SwaggerResponse.create[HttpStatus.OK])
  @ApiResponse(SwaggerResponse.create[HttpStatus.BAD_REQUEST])
  @ApiBody(SwaggerRequest.createBody)
  async create(@Body() input: CreateCategoryInput): Promise<CreatedModel> {
    return this.createCategory.execute(input)
  }

  @Put()
  @ApiResponse(SwaggerResponse.update[HttpStatus.OK])
  @ApiResponse(SwaggerResponse.update[HttpStatus.NOT_FOUND])
  @ApiResponse(SwaggerResponse.update[HttpStatus.CONFLICT])
  @ApiBody(SwaggerRequest.updateBody)
  async update(@Body() input: UpdateCategoryInput): Promise<UpdateCategoryOutput> {
    return this.updateCategory.execute(input)
  }
}
