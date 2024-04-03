import { createClient, RedisClientOptions, RedisClientType, SetOptions } from 'redis'

import { ILoggerAdapter } from '@/infra/logger'

import { ICacheAdapter } from '../adapter'
import { CacheKeyArgument, CacheValueArgument } from '../types'

export class RedisService implements ICacheAdapter<RedisClientType> {
  client: RedisClientType

  constructor(
    private readonly logger: ILoggerAdapter,
    private readonly config: RedisClientOptions
  ) {
    this.client = createClient(this.config) as RedisClientType
  }

  async connect(): Promise<RedisClientType> {
    try {
      await this.client.connect()
      this.logger.log('🎯 redis connected!')
      return this.client
    } catch (error) {
      this.logger.error(error)
      throw error
    }
  }

  async set(key: CacheKeyArgument, value: CacheValueArgument, options?: SetOptions): Promise<void> {
    await this.client.set(key, value, options)
  }

  async get(key: CacheKeyArgument): Promise<string> {
    return await this.client.get(key)
  }
}
