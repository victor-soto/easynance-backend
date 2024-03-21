import { Module } from '@nestjs/common'

import { InfraModule } from '@/infra/module'

import { AppController } from './app.controller'
import { AppService } from './app.service'

@Module({
  imports: [InfraModule],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
