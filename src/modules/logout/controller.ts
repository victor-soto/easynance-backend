import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common'

import { LogoutInput } from '@/core/user/usecases/types'

import { ILogoutAdapter } from './adapter'

@Controller()
export class LogoutController {
  constructor(private logoutUseCase: ILogoutAdapter) {}

  @Post('/logout')
  @HttpCode(HttpStatus.UNAUTHORIZED)
  async logout(@Body() body: LogoutInput): Promise<void> {
    return this.logoutUseCase.execute(body)
  }
}
