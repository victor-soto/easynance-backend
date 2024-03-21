import { Module } from '@nestjs/common'

import { LoggerModule } from '@/infra/logger'
import { ILoggerAdapter } from '@/infra/logger/adapter'
import { SecretModule } from '@/infra/secrets'
import { ISecretAdapter } from '@/infra/secrets/adapter'

import { IDatabaseAdapter } from '../adapter'
import { SequelizeService } from './service'

@Module({
  imports: [LoggerModule, SecretModule],
  providers: [
    {
      provide: IDatabaseAdapter,
      useFactory: async (logger: ILoggerAdapter, secret: ISecretAdapter) => {
        const database = new SequelizeService(logger, secret)
        await database.connect()
        return database
      },
      inject: [ILoggerAdapter, ISecretAdapter]
    }
  ],
  exports: [IDatabaseAdapter]
})
export class DatabaseModule {}
