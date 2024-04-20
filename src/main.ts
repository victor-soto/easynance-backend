import { RequestMethod, VersioningType } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

import { ApiExceptionFilter } from '@/common/filters/http-exception.filter'
import { ExceptionInterceptor } from '@/common/interceptors/http-exception.interceptor'
import { ILoggerAdapter } from '@/infra/logger'
import { ISecretAdapter } from '@/infra/secrets'

import { description, name, version } from '../package.json'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true })
  const loggerService = app.get(ILoggerAdapter)
  const { HOST, PORT, ENV, POSTGRES_HOST, POSTGRES_PORT, POSTGRES_DB } = app.get(ISecretAdapter)

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

  const config = new DocumentBuilder()
    .setTitle(name)
    .setDescription(description)
    .addBearerAuth()
    .setVersion(version)
    .addServer(HOST)
    .addTag('Swagger Documentation')
    .build()
  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('docs', app, document)

  await app.listen(PORT || 3000, () => {
    loggerService.log(`🟢 ${name} listening at ${PORT} on ${ENV?.toUpperCase()} 🟢`)
    loggerService.log(`🟢 Swagger listening at ${HOST}/docs 🟢`)
  })

  loggerService.log(`🔵 Postgres listening at postgresql://${POSTGRES_HOST}:${POSTGRES_PORT}/${POSTGRES_DB}`)
}
bootstrap()
