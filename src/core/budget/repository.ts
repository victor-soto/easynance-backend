import { Transaction } from 'sequelize'

import { IRepository } from '@/infra/repository/adapter'

import { BudgetEntity } from './entity/budget'

export abstract class IBudgetRepository extends IRepository<BudgetEntity> {
  abstract startTransaction<T = Transaction>(): Promise<T>
}
