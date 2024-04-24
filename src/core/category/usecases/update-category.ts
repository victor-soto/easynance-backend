import { ValidateSchema } from '@/common/decorators/validate-schema.decorator'
import { ApiConflictException, ApiNotFoundException } from '@/utils/exception'

import { CategoryEntity } from '../entity/category'
import { ICategoryRepository } from '../repository'
import { UpdateCategoryInput, UpdateCategoryOutput, UpdateCategorySchema } from './types'

export class UpdateCategoryUseCase {
  constructor(private readonly repository: ICategoryRepository) {}

  @ValidateSchema(UpdateCategorySchema)
  async execute(input: UpdateCategoryInput): Promise<UpdateCategoryOutput> {
    const category = await this.repository.findById(input.id)
    if (!category) throw new ApiNotFoundException('Category not found')

    const existingCategory = await this.repository.existsOnUpdate({ name: input.name }, { id: input.id })
    if (existingCategory) throw new ApiConflictException("Category's name exists")

    const entity = new CategoryEntity({ ...category, ...input })
    await this.repository.updateOne({ id: entity.id }, entity)
    const updated = await this.repository.findById(entity.id)
    return new CategoryEntity(updated)
  }
}
