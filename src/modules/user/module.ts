import { Module } from '@nestjs/common'
import { ModelCtor, Sequelize } from 'sequelize-typescript'

import { UserEntity } from '@/core/user/entity/user'
import { IUserRepository } from '@/core/user/repository'
import { CreateUserUseCase } from '@/core/user/usecases/create-user'
import { IDatabaseAdapter } from '@/infra/database/adapter'
import { DatabaseModule } from '@/infra/database/postgres'
import { UserSchema } from '@/infra/database/postgres/schemas/user'

import { ICreateUserAdapter } from './adapter'
import { UserController } from './controller'
import { UserRepository } from './repository'

@Module({
  imports: [DatabaseModule],
  providers: [
    {
      provide: IUserRepository,
      useFactory: (database: IDatabaseAdapter) => {
        const repository = database.getDatabase<Sequelize>().model(UserSchema)
        return new UserRepository(repository as ModelCtor<UserSchema> & UserEntity)
      },
      inject: [IDatabaseAdapter]
    },
    {
      provide: ICreateUserAdapter,
      useFactory: (repository: IUserRepository) => {
        return new CreateUserUseCase(repository)
      },
      inject: [IUserRepository]
    }
  ],
  controllers: [UserController]
})
export class UserModule {}
