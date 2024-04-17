import { Module } from '@nestjs/common'
import { ModelCtor, Sequelize } from 'sequelize-typescript'

import { PermissionEntity } from '@/core/permission/entity/permission'
import { IPermissionRepository } from '@/core/permission/repository'
import { IDatabaseAdapter } from '@/infra/database/adapter'
import { DatabaseModule } from '@/infra/database/postgres'
import { PermissionSchema } from '@/infra/database/postgres/schemas/permission'

import { PermissionRepository } from './repository'

@Module({
  imports: [DatabaseModule],
  providers: [
    {
      provide: IPermissionRepository,
      useFactory: (databaseAdapter: IDatabaseAdapter) => {
        const repository = databaseAdapter.getDatabase<Sequelize>().model(PermissionSchema)
        return new PermissionRepository(repository as ModelCtor<PermissionSchema> & PermissionEntity)
      },
      inject: [IDatabaseAdapter]
    }
  ],
  exports: [IPermissionRepository]
})
export class PermissionModule {}
