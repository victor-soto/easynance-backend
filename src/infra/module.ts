import { Module } from '@nestjs/common'

import { DatabaseModule } from './database/postgres/module'
import { LoggerModule } from './logger'
import { SecretModule } from './secrets'

@Module({
  imports: [SecretModule, DatabaseModule, LoggerModule]
})
export class InfraModule {}
