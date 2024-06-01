import { ValidateSchema } from '@/common/decorators/validate-schema.decorator'
import { ApiNotFoundException } from '@/utils/exception'

import { CategoryEntity } from '../entity/category'
import { ICategoryRepository } from '../repository'
import { DeleteCategoryInput, DeleteCategoryOutput, DeleteCategorySchema } from './types'

export class DeleteCategoryUseCase {
  constructor(private readonly repository: ICategoryRepository) {}

  @ValidateSchema(DeleteCategorySchema)
  async execute(input: DeleteCategoryInput): Promise<DeleteCategoryOutput> {
    const category = await this.repository.findById(input.id)
    if (!category) throw new ApiNotFoundException('Category not found')
    const entity = new CategoryEntity(category)
    entity.setDeleted()
    await this.repository.updateOne({ id: entity.id }, entity)
    return entity
  }
}
