import { Body, Controller, Delete, Get, HttpStatus, Post, Put, Query, Req } from '@nestjs/common'
import { ApiBearerAuth, ApiBody, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger'
import { Request } from 'express'

import {
  CreateCategoryInput,
  DeleteCategoryOutput,
  GetCategoryByIdInput,
  GetCategoryByIdOutput,
  ListCategoryInput,
  ListCategoryOutput,
  RestoreCategoryOutput,
  UpdateCategoryInput,
  UpdateCategoryOutput
} from '@/core/category/usecases/types'
import { CreatedModel } from '@/infra/repository/types'
import { SearchHttpSchema } from '@/utils/search'
import { SortHttpSchema } from '@/utils/sort'

import {
  ICategoryGetByIdAdapter,
  ICreateCategoryAdapter,
  IDeleteCategoryAdapter,
  IListCategoryAdapter,
  IRestoreCategoryAdapter,
  IUpdateCategoryAdapter
} from './adapter'
import { SwaggerRequest, SwaggerResponse } from './swagger'

@Controller({ path: 'categories', version: '1' })
@ApiTags('categories')
@ApiBearerAuth()
export class CategoryController {
  constructor(
    private readonly listCategory: IListCategoryAdapter,
    private readonly createCategory: ICreateCategoryAdapter,
    private readonly updateCategory: IUpdateCategoryAdapter,
    private readonly deleteCategory: IDeleteCategoryAdapter,
    private readonly categoryGetById: ICategoryGetByIdAdapter,
    private readonly restoreCategory: IRestoreCategoryAdapter
  ) {}

  @Get()
  @ApiResponse(SwaggerResponse.list[HttpStatus.OK])
  @ApiQuery(SwaggerRequest.listQuery.pagination.limit)
  @ApiQuery(SwaggerRequest.listQuery.pagination.page)
  @ApiQuery(SwaggerRequest.listQuery.sort)
  @ApiQuery(SwaggerRequest.listQuery.search)
  async list(@Query() query: ListCategoryInput): Promise<ListCategoryOutput> {
    query = {
      sort: SortHttpSchema.parse(query.sort),
      search: SearchHttpSchema.parse(query.search),
      limit: +query.limit,
      page: +query.page
    }
    return await this.listCategory.execute(query)
  }

  @Post()
  @ApiResponse(SwaggerResponse.create[HttpStatus.OK])
  @ApiResponse(SwaggerResponse.create[HttpStatus.BAD_REQUEST])
  @ApiBody(SwaggerRequest.createBody)
  async create(@Body() input: CreateCategoryInput): Promise<CreatedModel> {
    return await this.createCategory.execute(input)
  }

  @Put()
  @ApiResponse(SwaggerResponse.update[HttpStatus.OK])
  @ApiResponse(SwaggerResponse.update[HttpStatus.NOT_FOUND])
  @ApiResponse(SwaggerResponse.update[HttpStatus.CONFLICT])
  @ApiBody(SwaggerRequest.updateBody)
  async update(@Body() input: UpdateCategoryInput): Promise<UpdateCategoryOutput> {
    return await this.updateCategory.execute(input)
  }

  @Delete('/:id')
  @ApiResponse(SwaggerResponse.delete[HttpStatus.OK])
  @ApiResponse(SwaggerResponse.delete[HttpStatus.NOT_FOUND])
  @ApiParam({ name: 'id', required: true })
  async delete(@Req() { params }: Request): Promise<DeleteCategoryOutput> {
    return await this.deleteCategory.execute({ id: +params.id })
  }

  @Get('/:id')
  @ApiResponse(SwaggerResponse.getById[HttpStatus.OK])
  @ApiResponse(SwaggerResponse.getById[HttpStatus.NOT_FOUND])
  @ApiParam({ name: 'id', required: true })
  async getById(@Req() { params }: Request): Promise<GetCategoryByIdOutput> {
    return await this.categoryGetById.execute({ id: +params.id } as GetCategoryByIdInput)
  }

  @Put('/:id/restore')
  @ApiResponse(SwaggerResponse.restore[HttpStatus.OK])
  @ApiResponse(SwaggerResponse.restore[HttpStatus.NOT_FOUND])
  @ApiParam({ name: 'id', required: true })
  async restore(@Req() { params }: Request): Promise<RestoreCategoryOutput> {
    return await this.restoreCategory.execute({ id: +params.id } as RestoreCategoryOutput)
  }
}
