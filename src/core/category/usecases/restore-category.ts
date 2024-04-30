import { ApiNotFoundException } from '@/utils/exception'

import { CategoryEntity } from '../entity/category'
import { ICategoryRepository } from '../repository'
import { RestoreCategoryInput, RestoreCategoryOutput } from './types'

export class RestoreCategoryUseCase {
  constructor(private readonly repository: ICategoryRepository) {}

  async execute(input: RestoreCategoryInput): Promise<RestoreCategoryOutput> {
    const category = await this.repository.findOne({ id: input.id, active: false })
    if (!category) {
      throw new ApiNotFoundException('Category not found')
    }
    const entity = new CategoryEntity(category)
    entity.active = true
    await this.repository.updateOne({ id: entity.id }, entity)
    const updatedCategory = await this.repository.findById(entity.id)
    return new CategoryEntity(updatedCategory)
  }
}
