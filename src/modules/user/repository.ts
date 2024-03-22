import { Injectable } from '@nestjs/common'
import { Op, Transaction } from 'sequelize'
import { Model, ModelCtor } from 'sequelize-typescript'

import { UserEntity } from '@/core/user/entity/user'
import { IUserRepository } from '@/core/user/repository'
import { UserSchema } from '@/infra/database/postgres/schemas/user'
import { CreatedModel } from '@/infra/repository/types'
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

  async create(user: UserEntity, saveOptions: SaveOptionsType): Promise<CreatedModel> {
    const { schema, transaction } = DatabaseOptionsSchema.parse(saveOptions)
    const createdUser = await this.repository.schema(schema).create<Model<UserEntity>>(user, { transaction })
    const model = await createdUser.save()
    return { id: model.id, created: !!model.id }
  }
}
