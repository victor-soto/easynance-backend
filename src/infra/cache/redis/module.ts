import { Module } from '@nestjs/common'

import { ILoggerAdapter, LoggerModule } from '@/infra/logger'
import { ISecretAdapter, SecretModule } from '@/infra/secrets'

import { ICacheAdapter } from '../adapter'
import { RedisService } from './service'

@Module({
  imports: [SecretModule, LoggerModule],
  providers: [
    {
      provide: ICacheAdapter,
      useFactory: async (logger: ILoggerAdapter, { REDIS_URL }: ISecretAdapter) => {
        const cacheService = new RedisService(logger, { url: REDIS_URL })
        await cacheService.connect()
        return cacheService
      },
      inject: [ILoggerAdapter, ISecretAdapter]
    }
  ],
  exports: [ICacheAdapter]
})
export class RedisCacheModule {}
