import { z } from 'zod'

import { BaseEntity } from '@/utils/entity'

export const UserRoleEntitySchema = z.object({
  id: z.number().optional(),
  userId: z.number().optional(),
  roleId: z.number()
})

export type UserRole = z.infer<typeof UserRoleEntitySchema>

export class UserRoleEntity extends BaseEntity<UserRoleEntity>(UserRoleEntitySchema) {
  id: number
  userId?: number
  roleId: number

  constructor(entity: UserRole) {
    super()
    Object.assign(this, this.validate(entity))
  }
}
