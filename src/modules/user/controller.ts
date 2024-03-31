import { Body, Controller, Get, Post, Put, Query } from '@nestjs/common'

import { Public } from '@/common/decorators/public.decorator'
import {
  CreateUserInput,
  ListUserInput,
  ListUserOutput,
  UpdateUserInput,
  UpdateUserOutput
} from '@/core/user/usecases/types'
import { CreatedModel } from '@/infra/repository/types'
import { SearchHttpSchema } from '@/utils/search'
import { SortHttpSchema } from '@/utils/sort'

import { ICreateUserAdapter, IListUserAdapter, IUpdateUserAdapter } from './adapter'

@Controller('users')
export class UserController {
  constructor(
    private readonly createUser: ICreateUserAdapter,
    private readonly listUser: IListUserAdapter,
    private readonly updateUser: IUpdateUserAdapter
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
}
