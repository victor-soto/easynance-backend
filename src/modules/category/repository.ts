import { Injectable } from '@nestjs/common'
import { Transaction } from 'sequelize'
import { ModelCtor } from 'sequelize-typescript'

import { CategoryEntity } from '@/core/category/entity/category'
import { ICategoryRepository } from '@/core/category/repository'
import { CategorySchema } from '@/infra/database/postgres/schemas/category'
import { SequelizeRepository } from '@/infra/repository/postgres/repository'

type Model = ModelCtor<CategorySchema> & CategoryEntity

@Injectable()
export class CategoryRepository extends SequelizeRepository<Model> implements ICategoryRepository {
  constructor(private readonly repository: Model) {
    super(repository)
  }

  async startTransaction<T = Transaction>(): Promise<T> {
    const transaction = await this.repository.sequelize.transaction()
    return transaction as T
  }
}
