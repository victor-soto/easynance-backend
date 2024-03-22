import { z } from 'zod'

import { CreatedModel } from '@/infra/repository/types'

export const UserCreateSchema = z.object({
  username: z.string(),
  password: z.string(),
  email: z.string().email(),
  firstName: z.string(),
  lastName: z.string()
})

export type UserCreateInput = z.infer<typeof UserCreateSchema>
export type UserCreateOutput = CreatedModel
