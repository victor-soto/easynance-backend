import { z } from 'zod'

import { Role, RoleEntitySchema } from '@/core/role/entity/role'
import { BaseEntity } from '@/utils/entity'

export const UserEntitySchema = z.object({
  id: z.number().optional(),
  username: z.string(),
  password: z.string(),
  email: z.string().email(),
  firstName: z.string(),
  lastName: z.string(),
  active: z.boolean().default(true),
  roles: z.array(RoleEntitySchema)
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

  constructor(entity: User) {
    super()
    Object.assign(this, this.validate(entity))
  }

  anonymizePassword() {
    this.password = '**********'
  }
}
