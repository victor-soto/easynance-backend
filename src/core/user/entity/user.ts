import { z } from 'zod'

import { Role, RoleEntitySchema } from '@/core/role/entity/role'
import { UserRole, UserRoleEntitySchema } from '@/core/user-role/entity/user-role'
import { BaseEntity } from '@/utils/entity'

export const UserEntitySchema = z.object({
  id: z.number().optional(),
  username: z.string(),
  password: z.string(),
  email: z.string().email(),
  firstName: z.string(),
  lastName: z.string(),
  active: z.boolean().default(true),
  roles: z.array(RoleEntitySchema).optional(),
  userRoles: z.array(UserRoleEntitySchema).optional()
})

type User = z.infer<typeof UserEntitySchema>

export class UserEntity extends BaseEntity<UserEntity>(UserEntitySchema) {
  username: string
  password: string
  email: string
  firstName: string
  lastName: string
  active: boolean
  roles: Role[]
  userRoles: UserRole[]

  constructor(entity: User) {
    super()
    Object.assign(this, this.validate(entity))
  }

  anonymizePassword() {
    this.password = '**********'
  }
}
