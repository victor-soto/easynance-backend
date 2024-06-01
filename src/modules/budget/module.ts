import { Module } from '@nestjs/common'
import { ModelCtor, Sequelize } from 'sequelize-typescript'

import { BudgetEntity } from '@/core/budget/entity/budget'
import { IBudgetRepository } from '@/core/budget/repository'
import { CreateBudgetUserCase } from '@/core/budget/usecases/create-budget'
import { IDatabaseAdapter } from '@/infra/database/adapter'
import { DatabaseModule } from '@/infra/database/postgres/module'
import { BudgetSchema } from '@/infra/database/postgres/schemas/budget'

import { ICreateBudgetAdapter } from './adapter'
import { BudgetController } from './controller'
import { BudgetRepository } from './repository'

@Module({
  imports: [DatabaseModule],
  providers: [
    {
      provide: IBudgetRepository,
      useFactory: (database: IDatabaseAdapter) => {
        const repository = database.getDatabase<Sequelize>().model(BudgetSchema)
        return new BudgetRepository(repository as ModelCtor<BudgetSchema> & BudgetEntity)
      },
      inject: [IDatabaseAdapter]
    },
    {
      provide: ICreateBudgetAdapter,
      useFactory: (repository: IBudgetRepository) => new CreateBudgetUserCase(repository),
      inject: [IBudgetRepository]
    }
  ],
  controllers: [BudgetController]
})
export class BudgetModule {}
