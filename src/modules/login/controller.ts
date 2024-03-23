import { Body, Controller, Post } from '@nestjs/common'

import { LoginInput } from '@/core/user/usecases/types'

import { ILoginAdapter } from './adapter'

@Controller()
export class LoginController {
  constructor(private readonly useCase: ILoginAdapter) {}

  @Post('/login')
  async login(@Body() input: LoginInput) {
    return this.useCase.execute(input)
  }
}
