import { Module } from '@nestjs/common'

import { SecretModule } from '@/infra/secrets'

import { ILoggerAdapter } from './adapter'
import { LoggerService } from './service'

@Module({
  imports: [SecretModule],
  providers: [
    {
      provide: ILoggerAdapter,
      useFactory: () => {
        return new LoggerService()
      }
    }
  ],
  exports: [ILoggerAdapter]
})
export class LoggerModule {}
