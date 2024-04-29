import { CreatedModel, UpdatedModel } from './types'

export abstract class IRepository<T> {
  abstract create<TOptions = any>(entity: T, saveOptions?: TOptions): Promise<CreatedModel>

  abstract findById<TOpt = any>(id: string | number, options?: TOpt): Promise<T>

  abstract findAll<TQuery = Partial<T>, TOptions = any>(filter: TQuery, options?: TOptions | null): Promise<T[]>

  abstract updateOne<TQuery = Partial<T>, TUpdate = Partial<T>, TOptions = any>(
    filter: TQuery,
    updated: TUpdate,
    options?: TOptions
  ): Promise<UpdatedModel>

  abstract findOne<TQuery = Partial<T>, TOptions = any>(filter: TQuery, options?: TOptions): Promise<T>
}
