import { Transaction } from 'sequelize'

import { IRepository } from '@/infra/repository/adapter'

import { CategoryEntity } from './entity/category'

export abstract class ICategoryRepository extends IRepository<CategoryEntity> {
  abstract startTransaction<T = Transaction>(): Promise<T>

  abstract existsOnUpdate(equal: Pick<CategoryEntity, 'name'>, notEqual: Pick<CategoryEntity, 'id'>): Promise<boolean>
}
