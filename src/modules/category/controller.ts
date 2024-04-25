import { Body, Controller, Delete, HttpStatus, Post, Put, Req } from '@nestjs/common'
import { ApiBearerAuth, ApiBody, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger'
import { Request } from 'express'

import {
  CreateCategoryInput,
  DeleteCategoryOutput,
  UpdateCategoryInput,
  UpdateCategoryOutput
} from '@/core/category/usecases/types'
import { CreatedModel } from '@/infra/repository/types'

import { ICreateCategoryAdapter, IDeleteCategoryAdapter, IUpdateCategoryAdapter } from './adapter'
import { SwaggerRequest, SwaggerResponse } from './swagger'

@Controller({ path: 'categories', version: '1' })
@ApiTags('categories')
@ApiBearerAuth()
export class CategoryController {
  constructor(
    private readonly createCategory: ICreateCategoryAdapter,
    private readonly updateCategory: IUpdateCategoryAdapter,
    private readonly deleteCategory: IDeleteCategoryAdapter
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

  @Delete('/:id')
  @ApiResponse(SwaggerResponse.delete[HttpStatus.OK])
  @ApiResponse(SwaggerResponse.delete[HttpStatus.NOT_FOUND])
  @ApiParam({ name: 'id', required: true })
  async delete(@Req() { params }: Request): Promise<DeleteCategoryOutput> {
    return this.deleteCategory.execute({ id: +params.id })
  }
}
