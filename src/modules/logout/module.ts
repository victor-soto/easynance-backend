import { Module } from '@nestjs/common'

import { LogoutController } from './controller'

@Module({
  controllers: [LogoutController]
})
export class LogoutModule {}
