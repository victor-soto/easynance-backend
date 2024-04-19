import { RequestMethod, VersioningType } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'

import { ApiExceptionFilter } from '@/common/filters/http-exception.filter'
import { ExceptionInterceptor } from '@/common/interceptors/http-exception.interceptor'
import { ILoggerAdapter } from '@/infra/logger'

import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true })
  const loggerService = app.get(ILoggerAdapter)
  app.useLogger(loggerService)
  app.useGlobalFilters(new ApiExceptionFilter(loggerService))
  app.useGlobalInterceptors(new ExceptionInterceptor())
  app.setGlobalPrefix('api', {
    exclude: [
      { path: 'health', method: RequestMethod.GET },
      { path: '/', method: RequestMethod.GET }
    ]
  })
  app.enableVersioning({ type: VersioningType.URI })
  await app.listen(process.env.PORT || 3000)
}
bootstrap()
