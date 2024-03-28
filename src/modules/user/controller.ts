import { Body, Controller, Get, Post, Query } from '@nestjs/common'

import { CreateUserInput, ListUserInput, ListUserOutput } from '@/core/user/usecases/types'
import { CreatedModel } from '@/infra/repository/types'
import { SearchHttpSchema } from '@/utils/search'
import { SortHttpSchema } from '@/utils/sort'

import { ICreateUserAdapter, IListUserAdapter } from './adapter'

@Controller('users')
export class UserController {
  constructor(
    private readonly createUser: ICreateUserAdapter,
    private readonly listUser: IListUserAdapter
  ) {}

  @Post()
  async create(@Body() body: CreateUserInput): Promise<CreatedModel> {
    return this.createUser.execute(body as CreateUserInput)
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
}
