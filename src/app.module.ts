import { Module } from '@nestjs/common'
import { APP_GUARD } from '@nestjs/core'

import { InfraModule } from '@/infra/module'

import { AuthGuardInterceptor } from './common/interceptors/auth-guard.interceptor'
import { TokenModule } from './libs/auth'
import { LoginModule } from './modules/login/module'
import { LogoutModule } from './modules/logout/module'
import { UserModule } from './modules/user/module'

@Module({
  imports: [InfraModule, UserModule, LoginModule, LogoutModule, TokenModule],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuardInterceptor
    }
  ]
})
export class AppModule {}
