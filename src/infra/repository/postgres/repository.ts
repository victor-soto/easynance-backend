import { WhereOptions } from 'sequelize'
import { MakeNullishOptional } from 'sequelize/types/utils'
import { Model, ModelCtor } from 'sequelize-typescript'

import { ConvertSequelizeFilterToRepository } from '@/common/decorators/database/postgres/convert-sequelize-filter.decorator'
import { IEntity } from '@/utils/entity'
import { DatabaseOptionsSchema, DatabaseOptionsType, SaveOptionsType } from '@/utils/sequelize'

import { IRepository } from '../adapter'
import { CreatedModel, UpdatedModel } from '../types'

export class SequelizeRepository<T extends ModelCtor & IEntity> implements IRepository<T> {
  protected Model!: T

  constructor(model: T) {
    this.Model = model
  }

  async create<TOptions = SaveOptionsType>(entity: T, saveOptions?: TOptions): Promise<CreatedModel> {
    const { schema, transaction } = DatabaseOptionsSchema.parse(saveOptions)
    const savedEntity = await this.Model.schema(schema).create<Model<T>>(entity as unknown as MakeNullishOptional<T>, {
      transaction
    })

    const model = await savedEntity.save()

    return { id: model.id, created: !!model.id }
  }

  async findById<TOptions = DatabaseOptionsType>(id: string | number, options: TOptions): Promise<T> {
    const { schema } = DatabaseOptionsSchema.parse(options)

    const model = await this.Model.schema(schema).findOne({ where: { id } })

    if (!model) return

    return model.toJSON()
  }

  @ConvertSequelizeFilterToRepository()
  async findAll<TQuery = Partial<T>, TOptions = DatabaseOptionsType>(filter: TQuery, options?: TOptions): Promise<T[]> {
    const { schema } = DatabaseOptionsSchema.parse(options)

    const model = await this.Model.schema(schema).findAll({
      where: filter as WhereOptions<T>
    })

    return model.map((m) => m.toJSON())
  }

  async updateOne<TQuery = Partial<T>, TUpdate = Partial<T>, TOptions = DatabaseOptionsType>(
    filter: TQuery,
    updated: TUpdate,
    options?: TOptions
  ): Promise<UpdatedModel> {
    const { schema, transaction } = DatabaseOptionsSchema.parse(options)

    const model = await this.Model.schema(schema).update(updated, {
      where: filter as WhereOptions<T>,
      transaction
    })

    return {
      modifiedCount: model.length,
      matchedCount: model.length,
      upsertedCount: model.length
    }
  }

  @ConvertSequelizeFilterToRepository()
  async findOne<TQuery = Partial<T>, TOptions = DatabaseOptionsType>(filter: TQuery, options?: TOptions): Promise<T> {
    const { schema } = DatabaseOptionsSchema.parse(options)

    const model = await this.Model.schema(schema).findOne({
      where: filter as WhereOptions<T>
    })

    if (!model) return

    return model.toJSON()
  }
}
