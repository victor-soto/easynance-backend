import { Body, Controller, Post } from '@nestjs/common'

import { Public } from '@/common/decorators/public.decorator'
import { LoginInput } from '@/core/user/usecases/types'

import { ILoginAdapter } from './adapter'

@Controller({ version: '1' })
export class LoginController {
  constructor(private readonly useCase: ILoginAdapter) {}

  @Post('/login')
  @Public()
  async login(@Body() input: LoginInput) {
    return this.useCase.execute(input)
  }
}
