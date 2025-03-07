import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

import { ISecretAdapter } from './adapter'

@Injectable()
export class SecretService implements ISecretAdapter {
  constructor(private readonly config: ConfigService) {}

  HOST = this.config.get('HOST')
  POSTGRES_HOST = this.config.get('POSTGRES_HOST')
  POSTGRES_PORT = this.config.get<number>('POSTGRES_PORT')
  POSTGRES_DB = this.config.get('POSTGRES_DB')
  POSTGRES_USER = this.config.get('POSTGRES_USER')
  POSTGRES_PASSWORD = this.config.get('POSTGRES_PASSWORD')
  POSTGRES_TZ = this.config.get('POSTGRES_TZ')
  JWT_SECRET_KEY = this.config.get('JWT_SECRET_KEY')
  TOKEN_EXPIRATION = this.config.get('TOKEN_EXPIRATION')
  REDIS_URL = this.config.get('REDIS_URL')
  LOG_LEVEL = this.config.get('LOG_LEVEL')
  PORT = this.config.get<number>('PORT')
  ENV = this.config.get('ENV')
}
