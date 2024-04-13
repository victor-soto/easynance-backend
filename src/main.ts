import { NestFactory } from '@nestjs/core'

import { AppModule } from './app.module'
import { ApiExceptionFilter } from './common/filters/http-exception.filter'
import { ExceptionInterceptor } from './common/interceptors/http-exception.interceptor'
import { ILoggerAdapter } from './infra/logger'
import { URL_PREFIX } from './utils/constants'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true })
  const loggerService = app.get(ILoggerAdapter)
  app.useLogger(loggerService)
  app.useGlobalFilters(new ApiExceptionFilter(loggerService))
  app.useGlobalInterceptors(new ExceptionInterceptor())
  app.setGlobalPrefix(URL_PREFIX)
  await app.listen(3000)
}
bootstrap()
