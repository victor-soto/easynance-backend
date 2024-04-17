import { DatabaseOptionsType } from '@/utils/sequelize'

import { PermissionEntity } from './entity/permission'

export abstract class IPermissionRepository {
  abstract findAllByRoles(roles: number[], options?: DatabaseOptionsType): Promise<PermissionEntity[]>
}
