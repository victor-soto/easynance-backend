import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { ModelCtor, Sequelize } from 'sequelize-typescript'

import { IsLoggedMiddleware } from '@/common/middlewares'
import { BudgetEntity } from '@/core/budget/entity/budget'
import { IBudgetRepository } from '@/core/budget/repository'
import { CreateBudgetUserCase } from '@/core/budget/usecases/create-budget'
import { IUserRepository } from '@/core/user/repository'
import { RedisCacheModule } from '@/infra/cache/redis'
import { IDatabaseAdapter } from '@/infra/database/adapter'
import { DatabaseModule } from '@/infra/database/postgres/module'
import { BudgetSchema } from '@/infra/database/postgres/schemas/budget'
import { LoggerModule } from '@/infra/logger'
import { TokenModule } from '@/libs/auth'

import { UserModule } from '../user/module'
import { ICreateBudgetAdapter } from './adapter'
import { BudgetController } from './controller'
import { BudgetRepository } from './repository'

@Module({
  imports: [DatabaseModule, UserModule, LoggerModule, RedisCacheModule, TokenModule],
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
      useFactory: (repository: IBudgetRepository, userRepository: IUserRepository) =>
        new CreateBudgetUserCase(repository, userRepository),
      inject: [IBudgetRepository, IUserRepository]
    }
  ],
  controllers: [BudgetController]
})
export class BudgetModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(IsLoggedMiddleware).forRoutes(BudgetController)
  }
}
