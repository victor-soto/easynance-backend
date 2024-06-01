import { Injectable } from '@nestjs/common'
import { Transaction } from 'sequelize'
import { ModelCtor } from 'sequelize-typescript'

import { BudgetEntity } from '@/core/budget/entity/budget'
import { IBudgetRepository } from '@/core/budget/repository'
import { BudgetSchema } from '@/infra/database/postgres/schemas/budget'
import { SequelizeRepository } from '@/infra/repository/postgres/repository'

type Model = ModelCtor<BudgetSchema> & BudgetEntity

@Injectable()
export class BudgetRepository extends SequelizeRepository<Model> implements IBudgetRepository {
  constructor(private readonly repository: Model) {
    super(repository)
  }

  async startTransaction<T = Transaction>(): Promise<T> {
    const transaction = await this.repository.sequelize.transaction()
    return transaction as T
  }
}
