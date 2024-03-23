import { Module } from '@nestjs/common'
import { ModelCtor, Sequelize } from 'sequelize-typescript'

import { UserEntity } from '@/core/user/entity/user'
import { IUserRepository } from '@/core/user/repository'
import { CreateUserUseCase } from '@/core/user/usecases/create-user'
import { IDatabaseAdapter } from '@/infra/database/adapter'
import { DatabaseModule } from '@/infra/database/postgres'
import { UserSchema } from '@/infra/database/postgres/schemas/user'
import { CryptoLibModule, ICryptoAdapter } from '@/libs/crypto'

import { ICreateUserAdapter } from './adapter'
import { UserController } from './controller'
import { UserRepository } from './repository'

@Module({
  imports: [DatabaseModule, CryptoLibModule],
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
      useFactory: (repository: IUserRepository, crypto: ICryptoAdapter) => {
        return new CreateUserUseCase(repository, crypto)
      },
      inject: [IUserRepository, ICryptoAdapter]
    }
  ],
  controllers: [UserController],
  exports: [IUserRepository]
})
export class UserModule {}
