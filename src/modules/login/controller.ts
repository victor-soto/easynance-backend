import { Body, Controller, HttpStatus, Post } from '@nestjs/common'
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger'

import { Public } from '@/common/decorators/public.decorator'
import { LoginInput, LoginOutput } from '@/core/user/usecases/types'

import { ILoginAdapter } from './adapter'
import { SwaggerRequest, SwaggerResponse } from './swagger'

@Controller({ version: '1' })
@ApiTags('login')
export class LoginController {
  constructor(private readonly useCase: ILoginAdapter) {}

  @Post('/login')
  @Public()
  @ApiResponse(SwaggerResponse.login[HttpStatus.OK])
  @ApiResponse(SwaggerResponse.login[HttpStatus.NOT_FOUND])
  @ApiBody(SwaggerRequest.body)
  async login(@Body() input: LoginInput): Promise<LoginOutput> {
    return this.useCase.execute(input)
  }
}
