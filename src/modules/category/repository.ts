import { Injectable } from '@nestjs/common'
import { Op, Sequelize, Transaction } from 'sequelize'
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

  async existsOnUpdate(equal: Pick<CategoryEntity, 'name'>, notEqual: Pick<CategoryEntity, 'id'>): Promise<boolean> {
    const category = await this.repository.findOne({
      where: {
        [Op.and]: Sequelize.where(Sequelize.fn('lower', Sequelize.col('name')), Sequelize.fn('lower', equal.name)),
        [Op.not]: { ...notEqual }
      }
    })
    return !!category
  }
}
