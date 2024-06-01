import { ValidateSchema } from '@/common/decorators/validate-schema.decorator'
import { CreatedModel } from '@/infra/repository'
import { ICreateBudgetAdapter } from '@/modules/budget/adapter'

import { BudgetEntity } from '../entity/budget'
import { IBudgetRepository } from '../repository'
import { CreateBudgetInput, CreateBudgetSchema } from './types'

export class CreateBudgetUserCase implements ICreateBudgetAdapter {
  constructor(private readonly repository: IBudgetRepository) {}

  @ValidateSchema(CreateBudgetSchema)
  async execute(input: CreateBudgetInput): Promise<CreatedModel> {
    const { month, year, ...budgetInput } = input
    const startDate = new Date(year, month - 1, 1)
    const endDate = new Date(new Date(year, month, 0).getTime() - 1000)
    const entity = new BudgetEntity({ ...budgetInput, startDate, endDate })
    const transaction = await this.repository.startTransaction()
    try {
      const model = await this.repository.create(entity, { transaction })
      await transaction.commit()
      return model
    } catch (error) {
      await transaction.rollback()
      throw error
    }
  }
}
