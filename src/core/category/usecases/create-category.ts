import { UniqueConstraintError } from 'sequelize'

import { ValidateSchema } from '@/common/decorators/validate-schema.decorator'
import { CreatedModel } from '@/infra/repository/types'
import { ApiBadRequestException } from '@/utils/exception'

import { CategoryEntity } from '../entity/category'
import { ICategoryRepository } from '../repository'
import { CreateCategoryInput, CreateCategorySchema } from './types'

export class CreateCategoryUseCase {
  constructor(private readonly repository: ICategoryRepository) {}

  @ValidateSchema(CreateCategorySchema)
  async execute(input: CreateCategoryInput): Promise<CreatedModel> {
    const entity = new CategoryEntity(input)
    entity.iconAltText = input.iconAltText || input.name
    const transaction = await this.repository.startTransaction()
    try {
      const model = await this.repository.create(entity, { transaction })
      await transaction.commit()
      return model
    } catch (error) {
      await transaction.rollback()
      if (error instanceof UniqueConstraintError) {
        throw new ApiBadRequestException(error.errors?.[0].message)
      }
      throw error
    }
  }
}
