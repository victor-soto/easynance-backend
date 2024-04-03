import { Module } from '@nestjs/common'

import { ISecretAdapter, SecretModule } from '@/infra/secrets'

import { ILoggerAdapter } from './adapter'
import { LoggerService } from './service'

@Module({
  imports: [SecretModule],
  providers: [
    {
      provide: ILoggerAdapter,
      useFactory: async ({ LOG_LEVEL }: ISecretAdapter) => {
        const logger = new LoggerService()
        await logger.connect(LOG_LEVEL)
        return logger
      },
      inject: [ISecretAdapter]
    }
  ],
  exports: [ILoggerAdapter]
})
export class LoggerModule {}
