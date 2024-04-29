import { ValidateSchema } from '@/common/decorators/validate-schema.decorator'
import { ApiNotFoundException } from '@/utils/exception'

import { CategoryEntity } from '../entity/category'
import { ICategoryRepository } from '../repository'
import { GetCategoryByIdInput, GetCategoryByIdOutput, GetCategoryByIdSchema } from './types'

export class GetCategoryByIdUseCase {
  constructor(private readonly repository: ICategoryRepository) {}

  @ValidateSchema(GetCategoryByIdSchema)
  async execute({ id }: GetCategoryByIdInput): Promise<GetCategoryByIdOutput> {
    const category = await this.repository.findById(id)
    if (!category) throw new ApiNotFoundException('Category not found')
    return new CategoryEntity(category)
  }
}
