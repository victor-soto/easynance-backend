import { ValidateSchema } from '@/common/decorators/validate-schema.decorator'

import { CategoryEntity } from '../entity/category'
import { ICategoryRepository } from '../repository'
import { ListCategoryInput, ListCategoryOutput, ListCategorySchema } from './types'

export class ListCategoryUseCase {
  constructor(private readonly repository: ICategoryRepository) {}

  @ValidateSchema(ListCategorySchema)
  async execute(input: ListCategoryInput): Promise<ListCategoryOutput> {
    const categories = await this.repository.paginate(input)
    return {
      items: categories.items.map((c) => {
        return new CategoryEntity(c)
      }),
      limit: categories.limit,
      page: categories.page,
      total: categories.total
    }
  }
}
