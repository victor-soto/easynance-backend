import { Injectable } from '@nestjs/common'
import { ModelCtor } from 'sequelize-typescript'

import { RoleEntity } from '@/core/role/entity/role'
import { IRoleRepository } from '@/core/role/repository'
import { RoleSchema } from '@/infra/database/postgres/schemas/role'
import { SequelizeRepository } from '@/infra/repository/postgres/repository'

type Model = ModelCtor<RoleSchema> & RoleEntity

@Injectable()
export class RoleRepository extends SequelizeRepository<Model> implements IRoleRepository {}
