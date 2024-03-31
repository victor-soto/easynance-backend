import { Injectable } from '@nestjs/common'
import { Op, Transaction, WhereOptions } from 'sequelize'
import { Model, ModelCtor } from 'sequelize-typescript'

import { ConvertPaginateInputToSequelizeFilter } from '@/common/decorators/database/postgres/convert-paginate-input-to-sequelize-filter.decorator'
import { ValidateDatabaseSortAllowed } from '@/common/decorators/database/postgres/validate-database-sort-allowed.decorator'
import { SearchTypeEnum } from '@/common/decorators/types'
import { UserEntity } from '@/core/user/entity/user'
import { IUserRepository } from '@/core/user/repository'
import { ListUserInput, ListUserOutput } from '@/core/user/usecases/types'
import { UserSchema } from '@/infra/database/postgres/schemas/user'
import { CreatedModel, UpdatedModel } from '@/infra/repository/types'
import { DatabaseOptionsSchema, DatabaseOptionsType, SaveOptionsType } from '@/utils/sequelize'

type UserModel = ModelCtor<UserSchema> & UserEntity

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(private readonly repository: UserModel) {}

  async startTransaction<T = Transaction>(): Promise<T> {
    const transaction = await this.repository.sequelize.transaction()
    return transaction as T
  }

  async findByUsernameOrEmail(username: string, email: string, options?: DatabaseOptionsType): Promise<UserEntity> {
    const { schema } = DatabaseOptionsSchema.parse(options)
    const model = await this.repository.schema(schema).findOne({ where: { [Op.or]: [{ username }, { email }] } })
    if (!model) return
    return model.toJSON()
  }

  async findLogin(usernameOrEmail: string, options?: DatabaseOptionsType): Promise<UserEntity> {
    const { schema } = DatabaseOptionsSchema.parse(options)
    const model = await this.repository
      .schema(schema)
      .findOne({ where: { [Op.or]: [{ username: usernameOrEmail }, { email: usernameOrEmail }] } })
    if (!model) return
    return model.toJSON()
  }

  async findById(id: number, options?: DatabaseOptionsType): Promise<UserEntity> {
    const { schema } = DatabaseOptionsSchema.parse(options)
    const model = await this.repository.schema(schema).findOne({ where: { id } })
    if (!model) return
    return model.toJSON()
  }

  async create(user: UserEntity, saveOptions: SaveOptionsType): Promise<CreatedModel> {
    const { schema, transaction } = DatabaseOptionsSchema.parse(saveOptions)
    const createdUser = await this.repository.schema(schema).create<Model<UserEntity>>(user, { transaction })
    const model = await createdUser.save()
    return { id: model.id, created: !!model.id }
  }

  @ValidateDatabaseSortAllowed<UserEntity>('createdAt', 'firstName', 'lastName')
  @ConvertPaginateInputToSequelizeFilter<UserEntity>([
    { name: 'firstName', type: SearchTypeEnum.like },
    { name: 'lastName', type: SearchTypeEnum.like },
    { name: 'email', type: SearchTypeEnum.like },
    { name: 'username', type: SearchTypeEnum.like }
  ])
  async paginate(input: ListUserInput, options?: DatabaseOptionsType): Promise<ListUserOutput> {
    const { schema } = DatabaseOptionsSchema.parse(options)
    const list = await this.repository.schema(schema).findAndCountAll(input)
    return { items: list.rows.map((r) => new UserEntity(r)), limit: input.limit, page: input.page, total: list.count }
  }

  async existsOnUpdate(
    equalFilter: Pick<UserEntity, 'username'>,
    notEqualFilter: Pick<UserEntity, 'id'>
  ): Promise<boolean> {
    const user = await this.repository.findOne({ where: { ...equalFilter, ...notEqualFilter } })
    return !!user
  }

  async updateOne<TQuery = Partial<UserEntity>, TUpdate = Partial<UserEntity>, TOpts = DatabaseOptionsType>(
    filter: TQuery,
    updated: TUpdate,
    options?: TOpts
  ): Promise<UpdatedModel> {
    const { schema, transaction } = DatabaseOptionsSchema.parse(options)

    const model = await this.repository.schema(schema).update(updated, {
      where: filter as WhereOptions<UserEntity>,
      transaction
    })

    return {
      modifiedCount: model.length,
      matchedCount: model.length,
      upsertedCount: model.length
    }
  }
}
