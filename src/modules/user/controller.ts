import { Body, Controller, Post } from '@nestjs/common'

import { UserCreateInput } from '@/core/user/usecases/types'
import { CreatedModel } from '@/infra/repository/types'

import { ICreateUserAdapter } from './adapter'

@Controller('users')
export class UserController {
  constructor(private readonly createUser: ICreateUserAdapter) {}

  @Post()
  async create(@Body() body: UserCreateInput): Promise<CreatedModel> {
    return this.createUser.execute(body as UserCreateInput)
  }
}
