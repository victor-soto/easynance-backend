import { IRepository } from '@/infra/repository'

import { RoleEntity } from './entity/role'

export abstract class IRoleRepository extends IRepository<RoleEntity> {}
