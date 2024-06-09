import { ValidateSchema } from '@/common/decorators/validate-schema.decorator'
import { IUserRepository } from '@/core/user/repository'
import { ROLE } from '@/infra/database/postgres/schemas/role'
import { CreatedModel } from '@/infra/repository'
import { JwtType } from '@/libs/auth/types'
import { ICreateBudgetAdapter } from '@/modules/budget/adapter'

import { BudgetEntity } from '../entity/budget'
import { IBudgetRepository } from '../repository'
import { CreateBudgetInput, CreateBudgetSchema } from './types'

export class CreateBudgetUserCase implements ICreateBudgetAdapter {
  constructor(
    private readonly repository: IBudgetRepository,
    private readonly userRepository: IUserRepository
  ) {}

  @ValidateSchema(CreateBudgetSchema)
  async execute(input: CreateBudgetInput, user: JwtType): Promise<CreatedModel> {
    if (user.roles.some((role) => ROLE.USER === role)) {
      await this.setUserIdByLogin(user, input)
    }
    if (user.roles.some((role) => ROLE.ADMIN === role) && !input.userId) {
      await this.setUserIdByLogin(user, input)
    }
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

  async setUserIdByLogin(user: JwtType, input: CreateBudgetInput): Promise<void> {
    const userModel = await this.userRepository.findLogin(user.email)
    input.userId = userModel.id
  }
}
