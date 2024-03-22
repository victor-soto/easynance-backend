import { Module } from '@nestjs/common'

import { InfraModule } from '@/infra/module'

import { AppController } from './app.controller'
import { AppService } from './app.service'
import { UserModule } from './modules/user/module'

@Module({
  imports: [InfraModule, UserModule],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
