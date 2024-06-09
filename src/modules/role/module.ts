import { Module } from '@nestjs/common'
import { ModelCtor, Sequelize } from 'sequelize-typescript'

import { RoleEntity } from '@/core/role/entity/role'
import { IRoleRepository } from '@/core/role/repository'
import { IDatabaseAdapter } from '@/infra/database/adapter'
import { DatabaseModule } from '@/infra/database/postgres'
import { RoleSchema } from '@/infra/database/postgres/schemas/role'

import { RoleRepository } from './repository'

@Module({
  imports: [DatabaseModule],
  providers: [
    {
      provide: IRoleRepository,
      useFactory: (database: IDatabaseAdapter) => {
        const repository = database.getDatabase<Sequelize>().model(RoleSchema)
        return new RoleRepository(repository as ModelCtor<RoleSchema> & RoleEntity)
      },
      inject: [IDatabaseAdapter]
    }
  ],
  exports: [IRoleRepository]
})
export class RoleModule {}
