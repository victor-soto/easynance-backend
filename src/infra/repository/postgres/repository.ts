import { MakeNullishOptional } from 'sequelize/types/utils'
import { Model, ModelCtor } from 'sequelize-typescript'

import { IEntity } from '@/utils/entity'
import { DatabaseOptionsSchema, SaveOptionsType } from '@/utils/sequelize'

import { IRepository } from '../adapter'
import { CreatedModel } from '../types'

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
}
