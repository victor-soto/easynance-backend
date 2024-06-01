import { Injectable } from '@nestjs/common'
import { Op, Sequelize, Transaction } from 'sequelize'
import { ModelCtor } from 'sequelize-typescript'

import { ConvertPaginateInputToSequelizeFilter } from '@/common/decorators/database/postgres/convert-paginate-input-to-sequelize-filter.decorator'
import { ValidateDatabaseSortAllowed } from '@/common/decorators/database/postgres/validate-database-sort-allowed.decorator'
import { SearchTypeEnum } from '@/common/decorators/types'
import { CategoryEntity } from '@/core/category/entity/category'
import { ICategoryRepository } from '@/core/category/repository'
import { ListCategoryInput, ListCategoryOutput } from '@/core/category/usecases/types'
import { CategorySchema } from '@/infra/database/postgres/schemas/category'
import { SequelizeRepository } from '@/infra/repository/postgres/repository'
import { DatabaseOptionsSchema, DatabaseOptionsType } from '@/utils/sequelize'

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

  @ValidateDatabaseSortAllowed<CategoryEntity>('name', 'createdAt', 'updatedAt')
  @ConvertPaginateInputToSequelizeFilter<CategoryEntity>([
    { name: 'name', type: SearchTypeEnum.like },
    { name: 'active', type: SearchTypeEnum.equal },
    { name: 'type', type: SearchTypeEnum.equal }
  ])
  async paginate(input: ListCategoryInput, options?: DatabaseOptionsType): Promise<ListCategoryOutput> {
    const { schema } = DatabaseOptionsSchema.parse(options)
    const list = await this.repository.schema(schema).findAndCountAll(input)
    return {
      items: list.rows.map((c) => new CategoryEntity(c)),
      limit: input.limit,
      page: input.page,
      total: list.count
    }
  }
}
