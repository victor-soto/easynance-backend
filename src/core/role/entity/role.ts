import { z } from 'zod'

import { PermissionEntitySchema } from '@/core/permission/entity/permission'
import { BaseEntity } from '@/utils/entity'

export const RoleEntitySchema = z.object({
  id: z.number().optional(),
  name: z.string(),
  description: z.string().optional(),
  active: z.boolean(),
  permissions: z.array(PermissionEntitySchema)
})

export type Role = z.infer<typeof RoleEntitySchema>

export class RoleEntity extends BaseEntity<RoleEntity>(RoleEntitySchema) {
  id: number
  name: string
  description: string
  active: boolean

  constructor(entity: Role) {
    super()
    Object.assign(this, this.validate(entity))
  }
}
