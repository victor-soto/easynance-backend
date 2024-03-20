import { z } from 'zod'

import { BaseEntity } from '@/utils/entity'

export const UserEntitySchema = z.object({
  id: z.number(),
  username: z.string(),
  password: z.string(),
  email: z.string().email(),
  firstName: z.string(),
  lastName: z.string()
})

type User = z.infer<typeof UserEntitySchema>

export class UserEntity extends BaseEntity {
  username: string
  password: string
  email: string
  firstName: string
  lastName: string

  constructor(entity: User) {
    super()
    Object.assign(this, entity)
  }
}
