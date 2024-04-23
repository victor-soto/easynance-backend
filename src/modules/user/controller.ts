import { Body, Controller, Delete, Get, HttpStatus, Post, Put, Query, Req } from '@nestjs/common'
import { ApiBearerAuth, ApiBody, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger'
import { Request } from 'express'

import { Public } from '@/common/decorators/public.decorator'
import {
  CreateUserInput,
  DeleteUserOutput,
  ListUserInput,
  ListUserOutput,
  UpdateUserInput,
  UpdateUserOutput
} from '@/core/user/usecases/types'
import { CreatedModel } from '@/infra/repository/types'
import { SearchHttpSchema } from '@/utils/search'
import { SortHttpSchema } from '@/utils/sort'

import { ICreateUserAdapter, IDeleteUserAdapter, IListUserAdapter, IUpdateUserAdapter } from './adapter'
import { SwaggerRequest, SwaggerResponse } from './swagger'

@Controller({ path: 'users', version: '1' })
@ApiTags('users')
export class UserController {
  constructor(
    private readonly createUser: ICreateUserAdapter,
    private readonly listUser: IListUserAdapter,
    private readonly updateUser: IUpdateUserAdapter,
    private readonly deleteUser: IDeleteUserAdapter
  ) {}

  @Post()
  @Public()
  @ApiResponse(SwaggerResponse.create[HttpStatus.OK])
  @ApiBody(SwaggerRequest.createBody)
  async create(@Body() body: CreateUserInput): Promise<CreatedModel> {
    return this.createUser.execute(body as CreateUserInput)
  }

  @Put()
  @ApiResponse(SwaggerResponse.update[HttpStatus.OK])
  @ApiResponse(SwaggerResponse.update[HttpStatus.NOT_FOUND])
  @ApiBearerAuth()
  async update(@Body() body: UpdateUserInput): Promise<UpdateUserOutput> {
    return this.updateUser.execute(body)
  }

  @Get()
  @ApiQuery(SwaggerRequest.listQuery.pagination.limit)
  @ApiQuery(SwaggerRequest.listQuery.pagination.page)
  @ApiQuery(SwaggerRequest.listQuery.sort)
  @ApiQuery(SwaggerRequest.listQuery.search)
  @ApiResponse(SwaggerResponse.list[HttpStatus.OK])
  @ApiBearerAuth()
  async list(@Query() query: ListUserInput): Promise<ListUserOutput> {
    query = {
      sort: SortHttpSchema.parse(query.sort),
      search: SearchHttpSchema.parse(query.search),
      limit: +query.limit,
      page: +query.page
    }
    return this.listUser.execute(query)
  }

  @Delete('/:id')
  @ApiParam({ name: 'id', required: true })
  @ApiResponse(SwaggerResponse.delete[HttpStatus.OK])
  @ApiResponse(SwaggerResponse.delete[HttpStatus.NOT_FOUND])
  @ApiBearerAuth()
  async delete(@Req() { params }: Request): Promise<DeleteUserOutput> {
    return this.deleteUser.execute({ id: +params.id })
  }
}
