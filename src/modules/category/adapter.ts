import {
  CreateCategoryInput,
  DeleteCategoryInput,
  DeleteCategoryOutput,
  GetCategoryByIdInput,
  GetCategoryByIdOutput,
  ListCategoryInput,
  ListCategoryOutput,
  UpdateCategoryOutput
} from '@/core/category/usecases/types'
import { CreatedModel } from '@/infra/repository/types'

export abstract class ICreateCategoryAdapter {
  abstract execute(input: CreateCategoryInput): Promise<CreatedModel>
}

export abstract class IUpdateCategoryAdapter {
  abstract execute(input: CreateCategoryInput): Promise<UpdateCategoryOutput>
}

export abstract class IDeleteCategoryAdapter {
  abstract execute(input: DeleteCategoryInput): Promise<DeleteCategoryOutput>
}

export abstract class IListCategoryAdapter {
  abstract execute(input: ListCategoryInput): Promise<ListCategoryOutput>
}

export abstract class ICategoryGetByIdAdapter {
  abstract execute(input: GetCategoryByIdInput): Promise<GetCategoryByIdOutput>
}
