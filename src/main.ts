import { NestFactory } from '@nestjs/core'

import { AppModule } from './app.module'
import { ApiExceptionFilter } from './common/filters/http-exception.filter'
import { ILoggerAdapter } from './infra/logger'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true })
  const loggerService = app.get(ILoggerAdapter)
  app.useLogger(loggerService)
  app.useGlobalFilters(new ApiExceptionFilter(loggerService))
  await app.listen(3000)
}
bootstrap()
