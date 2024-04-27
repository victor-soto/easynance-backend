import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { ModelCtor, Sequelize } from 'sequelize-typescript'

import { IsLoggedMiddleware } from '@/common/middlewares'
import { CategoryEntity } from '@/core/category/entity/category'
import { ICategoryRepository } from '@/core/category/repository'
import { CreateCategoryUseCase } from '@/core/category/usecases/create-category'
import { DeleteCategoryUseCase } from '@/core/category/usecases/delete-category'
import { ListCategoryUseCase } from '@/core/category/usecases/list-category'
import { UpdateCategoryUseCase } from '@/core/category/usecases/update-category'
import { RedisCacheModule } from '@/infra/cache/redis'
import { IDatabaseAdapter } from '@/infra/database/adapter'
import { DatabaseModule } from '@/infra/database/postgres'
import { CategorySchema } from '@/infra/database/postgres/schemas/category'
import { LoggerModule } from '@/infra/logger'
import { TokenModule } from '@/libs/auth'

import { ICreateCategoryAdapter, IDeleteCategoryAdapter, IListCategoryAdapter, IUpdateCategoryAdapter } from './adapter'
import { CategoryController } from './controller'
import { CategoryRepository } from './repository'

@Module({
  imports: [DatabaseModule, LoggerModule, RedisCacheModule, TokenModule],
  providers: [
    {
      provide: ICategoryRepository,
      useFactory: (database: IDatabaseAdapter) => {
        const repository = database.getDatabase<Sequelize>().model(CategorySchema)
        return new CategoryRepository(repository as ModelCtor<CategorySchema> & CategoryEntity)
      },
      inject: [IDatabaseAdapter]
    },
    {
      provide: ICreateCategoryAdapter,
      useFactory: (repository: ICategoryRepository) => new CreateCategoryUseCase(repository),
      inject: [ICategoryRepository]
    },
    {
      provide: IUpdateCategoryAdapter,
      useFactory: (repository: ICategoryRepository) => new UpdateCategoryUseCase(repository),
      inject: [ICategoryRepository]
    },
    {
      provide: IDeleteCategoryAdapter,
      useFactory: (repository: ICategoryRepository) => new DeleteCategoryUseCase(repository),
      inject: [ICategoryRepository]
    },
    {
      provide: IListCategoryAdapter,
      useFactory: (repository: ICategoryRepository) => new ListCategoryUseCase(repository),
      inject: [ICategoryRepository]
    }
  ],
  controllers: [CategoryController]
})
export class CategoryModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(IsLoggedMiddleware).forRoutes(CategoryController)
  }
}
