import { RedisCacheKeyArgument, RedisCacheValueArgument } from './redis/types'

export abstract class ICacheAdapter<T = object> {
  abstract connect(): Promise<T>

  abstract set<
    TKey extends RedisCacheKeyArgument = RedisCacheKeyArgument,
    TValue extends RedisCacheValueArgument = RedisCacheValueArgument,
    TConf extends object = object
  >(key: TKey, value: TValue, config?: TConf): Promise<void>

  abstract get<TKey extends RedisCacheKeyArgument = RedisCacheKeyArgument>(key: TKey): Promise<string>
}
