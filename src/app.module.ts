import { Module } from '@nestjs/common'
import { APP_GUARD } from '@nestjs/core'

import { AuthGuardInterceptor } from '@/common/interceptors'
import { InfraModule } from '@/infra/module'
import { TokenModule } from '@/libs/auth'
import { BudgetModule } from '@/modules/budget/module'
import { CategoryModule } from '@/modules/category/module'
import { LoginModule } from '@/modules/login/module'
import { LogoutModule } from '@/modules/logout/module'
import { PermissionModule } from '@/modules/permission/module'
import { UserModule } from '@/modules/user/module'

@Module({
  imports: [
    InfraModule,
    UserModule,
    LoginModule,
    LogoutModule,
    TokenModule,
    PermissionModule,
    CategoryModule,
    BudgetModule
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuardInterceptor
    }
  ]
})
export class AppModule {}
