import { CreateBudgetInput } from '@/core/budget/usecases/types'
import { CreatedModel } from '@/infra/repository/types'
import { JwtType } from '@/libs/auth'

export abstract class ICreateBudgetAdapter {
  abstract execute(input: CreateBudgetInput, user: JwtType): Promise<CreatedModel>
}
