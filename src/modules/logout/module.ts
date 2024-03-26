import { Module } from '@nestjs/common'

import { LogoutUseCase } from '@/core/user/usecases/logout-user'
import { ICacheAdapter } from '@/infra/cache/adapter'
import { RedisCacheModule } from '@/infra/cache/redis'
import { ISecretAdapter, SecretModule } from '@/infra/secrets'

import { ILogoutAdapter } from './adapter'
import { LogoutController } from './controller'

@Module({
  controllers: [LogoutController],
  imports: [SecretModule, RedisCacheModule],
  providers: [
    {
      provide: ILogoutAdapter,
      useFactory: (secret: ISecretAdapter, cacheService: ICacheAdapter) => {
        return new LogoutUseCase(secret, cacheService)
      },
      inject: [ISecretAdapter, ICacheAdapter]
    }
  ]
})
export class LogoutModule {}
