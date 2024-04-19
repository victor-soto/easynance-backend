import { Body, Controller, Delete, Get, Post, Put, Query, Req } from '@nestjs/common'
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

@Controller({ path: 'users', version: '1' })
export class UserController {
  constructor(
    private readonly createUser: ICreateUserAdapter,
    private readonly listUser: IListUserAdapter,
    private readonly updateUser: IUpdateUserAdapter,
    private readonly deleteUser: IDeleteUserAdapter
  ) {}

  @Post()
  @Public()
  async create(@Body() body: CreateUserInput): Promise<CreatedModel> {
    return this.createUser.execute(body as CreateUserInput)
  }

  @Put()
  async update(@Body() body: UpdateUserInput): Promise<UpdateUserOutput> {
    return this.updateUser.execute(body)
  }

  @Get()
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
  async delete(@Req() { params }: Request): Promise<DeleteUserOutput> {
    return this.deleteUser.execute({ id: +params.id })
  }
}
