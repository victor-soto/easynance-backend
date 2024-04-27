import { Transaction } from 'sequelize'

import { IRepository } from '@/infra/repository/adapter'
import { DatabaseOptionsType } from '@/utils/sequelize'

import { CategoryEntity } from './entity/category'
import { ListCategoryInput, ListCategoryOutput } from './usecases/types'

export abstract class ICategoryRepository extends IRepository<CategoryEntity> {
  abstract startTransaction<T = Transaction>(): Promise<T>

  abstract existsOnUpdate(equal: Pick<CategoryEntity, 'name'>, notEqual: Pick<CategoryEntity, 'id'>): Promise<boolean>

  abstract paginate<TOptions = DatabaseOptionsType>(
    input: ListCategoryInput,
    options?: TOptions
  ): Promise<ListCategoryOutput>
}
