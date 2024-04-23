import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common'
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger'

import { LogoutInput } from '@/core/user/usecases/types'

import { ILogoutAdapter } from './adapter'
import { SwaggerRequest, SwaggerResponse } from './swagger'

@Controller({ version: '1' })
@ApiTags('logout')
@ApiBearerAuth()
export class LogoutController {
  constructor(private logoutUseCase: ILogoutAdapter) {}

  @Post('/logout')
  @HttpCode(HttpStatus.UNAUTHORIZED)
  @ApiResponse(SwaggerResponse.logout[HttpStatus.UNAUTHORIZED])
  @ApiResponse(SwaggerResponse.logout[HttpStatus.OK])
  @ApiBody(SwaggerRequest.body)
  @HttpCode(HttpStatus.UNAUTHORIZED)
  async logout(@Body() body: LogoutInput): Promise<void> {
    return this.logoutUseCase.execute(body)
  }
}
