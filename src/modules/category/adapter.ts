import { CreateCategoryInput } from '@/core/category/usecases/types'
import { CreatedModel } from '@/infra/repository/types'

export abstract class ICreateCategoryAdapter {
  abstract execute(input: CreateCategoryInput): Promise<CreatedModel>
}
