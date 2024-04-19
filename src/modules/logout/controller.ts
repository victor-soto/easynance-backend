import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common'

import { Public } from '@/common/decorators/public.decorator'
import { LogoutInput } from '@/core/user/usecases/types'

import { ILogoutAdapter } from './adapter'

@Controller({ version: '1' })
export class LogoutController {
  constructor(private logoutUseCase: ILogoutAdapter) {}

  @Post('/logout')
  @HttpCode(HttpStatus.UNAUTHORIZED)
  @Public()
  async logout(@Body() body: LogoutInput): Promise<void> {
    return this.logoutUseCase.execute(body)
  }
}
