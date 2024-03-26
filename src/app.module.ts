import { Module } from '@nestjs/common'

import { InfraModule } from '@/infra/module'

import { AppController } from './app.controller'
import { AppService } from './app.service'
import { LoginModule } from './modules/login/module'
import { LogoutModule } from './modules/logout/module'
import { UserModule } from './modules/user/module'

@Module({
  imports: [InfraModule, UserModule, LoginModule, LogoutModule],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
