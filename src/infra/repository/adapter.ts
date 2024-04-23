import { CreatedModel } from './types'

export abstract class IRepository<T> {
  abstract create<TOptions = any>(entity: T, saveOptions?: TOptions): Promise<CreatedModel>
}
