import { CreateBudgetInput } from '@/core/budget/usecases/types'
import { CreatedModel } from '@/infra/repository/types'

export abstract class ICreateBudgetAdapter {
  abstract execute(input: CreateBudgetInput): Promise<CreatedModel>
}
