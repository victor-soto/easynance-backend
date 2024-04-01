import { z } from 'zod'

import { BaseEntity } from '@/utils/entity'

export const UserEntitySchema = z.object({
  id: z.number().optional(),
  username: z.string(),
  password: z.string(),
  email: z.string().email(),
  firstName: z.string(),
  lastName: z.string(),
  active: z.boolean().default(true)
})

type User = z.infer<typeof UserEntitySchema>

export class UserEntity extends BaseEntity<UserEntity>(UserEntitySchema) {
  username: string
  password: string
  email: string
  firstName: string
  lastName: string
  active: boolean

  constructor(entity: User) {
    super()
    Object.assign(this, this.validate(entity))
  }

  anonymizePassword() {
    this.password = '**********'
  }
}
