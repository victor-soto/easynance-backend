import { Injectable } from '@nestjs/common'
import { Op } from 'sequelize'
import { ModelCtor } from 'sequelize-typescript'

import { PermissionEntity } from '@/core/permission/entity/permission'
import { IPermissionRepository } from '@/core/permission/repository'
import { PermissionSchema } from '@/infra/database/postgres/schemas/permission'
import { RoleSchema } from '@/infra/database/postgres/schemas/role'
import { DatabaseOptionsSchema, DatabaseOptionsType } from '@/utils/sequelize'

type PermissionModel = ModelCtor<PermissionSchema> & PermissionEntity

@Injectable()
export class PermissionRepository implements IPermissionRepository {
  constructor(private readonly repository: PermissionModel) {}

  async findAllByRoles(roles: number[], options?: DatabaseOptionsType): Promise<PermissionEntity[]> {
    const { schema } = DatabaseOptionsSchema.parse(options)
    const model = await this.repository
      .schema(schema)
      .findAll({ where: { '$roles.id$': { [Op.in]: roles } }, include: [{ model: RoleSchema, as: 'roles' }] })
    return model.map((p) => new PermissionEntity(p))
  }
}
